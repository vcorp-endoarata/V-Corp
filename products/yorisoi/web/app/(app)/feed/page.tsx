import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PostComposer } from "@/components/PostComposer";
import { PostCard } from "@/components/PostCard";
import { SpaceSwitcher } from "@/components/SpaceSwitcher";

type SpaceKey = "self" | "family" | "shared";

export const metadata = {
  title: "フィード — よりそい",
  robots: { index: false, follow: false },
};

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ space?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nickname, role")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/onboarding");

  // role に応じてアクセス可能スペース
  const accessibleSpaces: SpaceKey[] =
    profile.role === "self" ? ["self", "shared"] : ["family", "shared"];
  const defaultSpace = accessibleSpaces[0];

  const params = await searchParams;
  const requested = params.space as SpaceKey | undefined;
  const space: SpaceKey = (
    requested && accessibleSpaces.includes(requested) ? requested : defaultSpace
  ) as SpaceKey;

  // posts 取得 (RLS で自動フィルタ)
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id, body, category, space, empathy_count, created_at,
      author:profiles!posts_author_id_fkey(id, nickname, role)
    `,
    )
    .eq("space", space)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(50);

  // 自分の empathy 履歴 (どの post にうなずいたか)
  const { data: myEmpathy } = await supabase
    .from("empathy")
    .select("post_id")
    .eq("user_id", user.id);
  const empathySet = new Set((myEmpathy ?? []).map((e) => e.post_id));

  return (
    <div className="space-y-6">
      <SpaceSwitcher current={space} accessible={accessibleSpaces} />

      <PostComposer defaultSpace={space} role={profile.role} />

      <section className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((p) => (
            <PostCard
              key={p.id}
              post={p as never}
              hasEmpathy={empathySet.has(p.id)}
              isOwn={(p as never as { author: { id: string } }).author?.id === user.id}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-wabi p-10 text-center text-sm text-sumi/70">
            まだ投稿がありません。
            <br />
            最初のひとことを、書いてみませんか?
          </div>
        )}
      </section>
    </div>
  );
}
