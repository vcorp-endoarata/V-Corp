import type { SupabaseClient } from "@supabase/supabase-js";
import { getRelationFilters } from "@/lib/relations";

/**
 * 「返事を待っている」投稿を取得する。
 *
 * 定義:
 * - reply_count = 0 (まだ誰も返信していない)
 * - category in ('worry', 'question') (返信が必要なジャンル)
 * - status = 'published'
 * - 自分の投稿は除外 (自作自演を防ぐ)
 * - block/mute した相手の投稿は除外 (ホワイトリストでフィルタ)
 * - アクセス可能なスペースのみ (RLS で自動)
 *
 * ソート: created_at ASC (古い順 = 公平、放置されている投稿を救う)
 */
export async function getWaitingPosts(
  supabase: SupabaseClient,
  userId: string,
  limit = 30,
) {
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id, body, category, space, empathy_count, reply_count, created_at,
      author:profiles!posts_author_id_fkey(id, nickname, role, show_role, avatar_url),
      media:post_media(id, kind, storage_path, width, height, blurred)
    `,
    )
    .eq("status", "published")
    .eq("reply_count", 0)
    .in("category", ["worry", "question"])
    .neq("author_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit);

  // ブロック/ミュート除外
  const { hiddenAuthors } = await getRelationFilters(userId);
  return (posts ?? []).filter((p) => {
    const author = (p as never as { author: { id: string } }).author;
    return !hiddenAuthors.has(author?.id);
  });
}
