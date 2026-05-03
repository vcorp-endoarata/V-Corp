import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CrisisReviewButton } from "@/components/CrisisReviewButton";

export const metadata = {
  title: "危機イベント — よりそい",
  robots: { index: false, follow: false },
};

const SEVERITY_LABEL: Record<string, { label: string; className: string }> = {
  high: {
    label: "🚨 high",
    className: "bg-sakura/20 text-sakura",
  },
  medium: {
    label: "⚠ medium",
    className: "bg-amber-100 text-amber-700",
  },
  low: {
    label: "ℹ low",
    className: "bg-sage/10 text-sage",
  },
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}時間前`;
  const day = Math.floor(hr / 24);
  return `${day}日前`;
}

export default async function CrisisAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nickname, is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <div className="rounded-2xl border border-wabi bg-white/70 p-10 text-center">
        <p className="text-sm text-sumi">
          このページは運営者専用です。
        </p>
      </div>
    );
  }

  const params = await searchParams;
  const filter = params.filter === "all" ? "all" : "pending";

  const admin = createAdminClient();

  let query = admin
    .from("crisis_events")
    .select(
      "id, ai_response, resources_shown, user_acknowledged, reviewed_by_admin, reviewed_by_admin_at, admin_note, created_at, user:profiles!crisis_events_user_id_fkey(id, nickname, role), post:posts!crisis_events_post_id_fkey(id, body, status)",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (filter === "pending") {
    query = query.eq("reviewed_by_admin", false);
  }

  const { data: events } = await query;

  const { count: pendingCount } = await admin
    .from("crisis_events")
    .select("id", { count: "exact", head: true })
    .eq("reviewed_by_admin", false);

  return (
    <div className="space-y-6">
      <header>
        <Link
          href="/admin"
          className="text-sm text-sumi hover:text-sage"
        >
          ← 通報一覧に戻る
        </Link>
        <h1 className="mt-2 font-display text-2xl text-ink">
          危機イベント
        </h1>
        <p className="mt-1 text-xs text-sumi/70">
          投稿者本人にだけ相談先を表示済。必要に応じて運営から個別フォローアップを検討してください。
        </p>
      </header>

      <nav className="flex gap-2 text-xs" aria-label="フィルタ">
        <Link
          href="/admin/crisis?filter=pending"
          className={`rounded-full px-3 py-1.5 ${
            filter === "pending"
              ? "bg-sakura/20 text-sakura"
              : "border border-wabi text-sumi hover:bg-sage/5"
          }`}
        >
          未対応 ({pendingCount ?? 0})
        </Link>
        <Link
          href="/admin/crisis?filter=all"
          className={`rounded-full px-3 py-1.5 ${
            filter === "all"
              ? "bg-sage/20 text-sage"
              : "border border-wabi text-sumi hover:bg-sage/5"
          }`}
        >
          すべて
        </Link>
      </nav>

      {!events || events.length === 0 ? (
        <div className="rounded-2xl border border-wabi bg-white/70 p-10 text-center text-sm text-sumi/70">
          {filter === "pending"
            ? "現在、未対応の危機イベントはありません。"
            : "まだ危機イベントの記録はありません。"}
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((e) => {
            const userObj = e.user as unknown as {
              id: string;
              nickname: string;
              role: string;
            } | null;
            const postObj = e.post as unknown as {
              id: string;
              body: string;
              status: string;
            } | null;
            const aiResponse =
              (e.ai_response as { severity?: string } | null) ?? {};
            const sev = SEVERITY_LABEL[aiResponse.severity ?? "low"];

            return (
              <article
                key={e.id}
                className="rounded-2xl border border-wabi bg-white/70 p-5"
              >
                <header className="flex items-center justify-between text-xs text-sumi/70">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${sev.className}`}
                    >
                      {sev.label}
                    </span>
                    <span>
                      {userObj?.nickname ?? "(unknown)"}
                    </span>
                    <span>•</span>
                    <span>{userObj?.role}</span>
                    {e.reviewed_by_admin && (
                      <span className="rounded-full bg-sage/10 px-2 py-0.5 text-sage">
                        ✓ 確認済
                      </span>
                    )}
                  </div>
                  <time>{timeAgo(e.created_at)}</time>
                </header>

                {postObj && (
                  <Link
                    href={`/post/${postObj.id}`}
                    className="mt-3 block rounded-xl bg-cream p-3 text-sm text-ink hover:bg-sage/5"
                  >
                    <p className="line-clamp-3 whitespace-pre-wrap">
                      {postObj.body}
                    </p>
                    <p className="mt-1 text-xs text-sumi/60">
                      投稿を見る → ({postObj.status})
                    </p>
                  </Link>
                )}

                {e.admin_note && (
                  <p className="mt-3 rounded-lg bg-sage/5 p-2 text-xs text-sumi">
                    📝 {e.admin_note}
                  </p>
                )}

                <footer className="mt-4 flex items-center justify-between border-t border-wabi/60 pt-3 text-xs">
                  <span className="text-sumi/60">
                    {e.user_acknowledged
                      ? "本人が確認済"
                      : "本人未確認"}
                  </span>
                  <CrisisReviewButton
                    crisisId={e.id}
                    reviewed={e.reviewed_by_admin}
                  />
                </footer>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
