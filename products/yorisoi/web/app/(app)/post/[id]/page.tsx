import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostCard } from "@/components/PostCard";
import { ReplyComposer } from "@/components/ReplyComposer";
import { ReplyCard } from "@/components/ReplyCard";

export const metadata = {
  title: "投稿 — よりそい",
  robots: { index: false, follow: false },
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/onboarding");

  // post (RLS で空間アクセス制御済)
  const { data: post } = await supabase
    .from("posts")
    .select(
      `
      id, body, category, space, empathy_count, reply_count, status, created_at,
      author:profiles!posts_author_id_fkey(id, nickname, role),
      media:post_media(id, kind, storage_path, width, height, blurred)
    `,
    )
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  // hidden / deleted 投稿は本人以外には 404 (本人には見せる)
  const postAny = post as never as {
    status: string;
    author: { id: string };
  };
  if (postAny.status !== "published" && postAny.author.id !== user.id) {
    notFound();
  }

  // 自分のうなずき有無
  const { data: myEmpathy } = await supabase
    .from("empathy")
    .select("post_id")
    .eq("user_id", user.id)
    .eq("post_id", id)
    .maybeSingle();

  // 返信一覧 (作成順)
  const { data: replies } = await supabase
    .from("replies")
    .select(
      `
      id, body, status, created_at, author_id,
      author:profiles!replies_author_id_fkey(id, nickname, role)
    `,
    )
    .eq("post_id", id)
    .eq("status", "published")
    .order("created_at", { ascending: true })
    .limit(200);

  return (
    <div className="space-y-6">
      <Link
        href="/feed"
        className="inline-flex items-center text-sm text-sumi hover:text-sage"
      >
        ← フィードに戻る
      </Link>

      <PostCard
        post={post as never}
        hasEmpathy={!!myEmpathy}
        isOwn={postAny.author.id === user.id}
        hideReplyLink
      />

      {/* 返信フォーム */}
      <section
        aria-labelledby="reply-section"
        className="rounded-2xl border border-wabi/60 bg-cream p-5"
      >
        <h2 id="reply-section" className="text-sm font-semibold text-ink">
          返信を書く
        </h2>
        <p className="mt-1 text-xs text-sumi/70">
          静かに、寄り添う気持ちで。否定や評価はしないでください。
        </p>
        <div className="mt-4">
          <ReplyComposer postId={id} />
        </div>
      </section>

      {/* 返信一覧 */}
      <section
        aria-labelledby="replies-list"
        className="space-y-3"
      >
        <h2
          id="replies-list"
          className="text-sm font-semibold text-ink"
        >
          みんなの返信 ({replies?.length ?? 0})
        </h2>
        {replies && replies.length > 0 ? (
          replies.map((r) => {
            const reply = r as never as {
              id: string;
              body: string;
              created_at: string;
              author_id: string;
              author: { id: string; nickname: string; role: string };
            };
            return (
              <ReplyCard
                key={reply.id}
                reply={reply}
                isOwn={reply.author_id === user.id}
              />
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-wabi p-8 text-center text-sm text-sumi/60">
            まだ返信はありません。
            <br />
            最初の「そばにいるよ」を、書いてみませんか?
          </div>
        )}
      </section>
    </div>
  );
}
