import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 投稿の本文検索 (シンプル版)。
 * Postgres ILIKE で部分一致。RLS で空間アクセス制御は自動適用される。
 *
 * GET /api/search?q=キーワード&limit=30
 */
export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "未ログインです" }, { status: 401 });
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const limit = Math.min(
    parseInt(url.searchParams.get("limit") ?? "30", 10) || 30,
    100,
  );

  if (q.length < 1) {
    return NextResponse.json({ posts: [] });
  }
  if (q.length > 100) {
    return NextResponse.json(
      { error: "検索キーワードが長すぎます (100字以内)" },
      { status: 400 },
    );
  }

  // 特殊文字のエスケープ (LIKE 用)
  const escaped = q.replace(/([%_\\])/g, "\\$1");

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id, body, category, space, empathy_count, reply_count, created_at,
      author:profiles!posts_author_id_fkey(id, nickname, role, show_role),
      media:post_media(id, kind, storage_path, width, height, blurred)
    `,
    )
    .eq("status", "published")
    .ilike("body", `%${escaped}%`)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: posts ?? [], q });
}
