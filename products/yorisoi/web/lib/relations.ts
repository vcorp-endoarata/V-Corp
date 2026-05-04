import { createClient } from "@/lib/supabase/server";

/**
 * 自分が block/mute している user_id 一覧と、
 * 自分が block されている user_id 一覧 を取得。
 *
 * フィード/投稿一覧の query で除外フィルタとして使う。
 */
export async function getRelationFilters(userId: string): Promise<{
  hiddenAuthors: Set<string>; // block/mute した相手 (= 見たくない)
  blockedByAuthors: Set<string>; // 自分を block している相手 (= 見せられない)
}> {
  const supabase = await createClient();

  // 自分が block/mute してる相手
  const { data: myRelations } = await supabase
    .from("user_relations")
    .select("target_id, kind")
    .eq("user_id", userId);

  const hiddenAuthors = new Set<string>(
    (myRelations ?? []).map((r) => r.target_id as string),
  );

  return {
    hiddenAuthors,
    blockedByAuthors: new Set(),
  };
}
