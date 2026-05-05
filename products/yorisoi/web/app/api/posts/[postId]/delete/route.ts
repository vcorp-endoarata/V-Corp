import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * 投稿削除フロー (ハイブリッド):
 * - reply_count = 0 → 即時 status='deleted'
 * - reply_count > 0 → deletion_requests に申請 (運営審査)
 *
 * 自分の投稿のみ操作可能。
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> },
) {
  const { postId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "未ログインです" }, { status: 401 });
  }

  const { data: post } = await supabase
    .from("posts")
    .select("id, author_id, status, reply_count")
    .eq("id", postId)
    .maybeSingle();

  if (!post) {
    return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
  }
  if (post.author_id !== user.id) {
    return NextResponse.json(
      { error: "自分の投稿のみ削除できます" },
      { status: 403 },
    );
  }
  if (post.status === "deleted") {
    return NextResponse.json(
      { error: "既に削除されています" },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  if ((post.reply_count ?? 0) === 0) {
    // 返信ゼロ → 即時削除
    const { error } = await admin
      .from("posts")
      .update({ status: "deleted" })
      .eq("id", postId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, mode: "immediate" });
  }

  // 返信あり → 削除申請 (重複申請は unique index で弾かれる)
  const { error } = await admin.from("deletion_requests").insert({
    post_id: postId,
    requester_id: user.id,
  });
  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, mode: "requested_already" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, mode: "requested" });
}
