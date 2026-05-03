import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "設定 — よりそい",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nickname")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/onboarding");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">設定</h1>

      {/* アカウント情報 */}
      <section className="rounded-2xl border border-wabi bg-white/70 p-5">
        <h2 className="text-sm font-semibold text-ink">アカウント</h2>
        <dl className="mt-3 space-y-2 text-sm text-sumi">
          <div className="flex justify-between">
            <dt>ニックネーム</dt>
            <dd className="text-ink">{profile.nickname}</dd>
          </div>
          <div className="flex justify-between">
            <dt>メールアドレス</dt>
            <dd className="text-ink">{user.email}</dd>
          </div>
        </dl>
        <Link
          href="/profile/edit"
          className="mt-4 inline-block rounded-full border border-wabi px-4 py-1.5 text-sm text-sumi hover:bg-sage/5"
        >
          プロフィールを編集
        </Link>
      </section>

      {/* 通知設定 (Phase 4 で実装予定) */}
      <section className="rounded-2xl border border-wabi bg-white/40 p-5 opacity-60">
        <h2 className="text-sm font-semibold text-ink">通知</h2>
        <p className="mt-2 text-sm text-sumi">
          メール通知の設定は後日追加します。
        </p>
      </section>

      {/* 法務リンク */}
      <section className="rounded-2xl border border-wabi bg-white/70 p-5">
        <h2 className="text-sm font-semibold text-ink">情報</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/legal/terms" className="text-sage hover:underline">
              利用規約
            </Link>
          </li>
          <li>
            <Link href="/legal/privacy" className="text-sage hover:underline">
              プライバシーポリシー
            </Link>
          </li>
          <li>
            <Link href="/legal/tokutei" className="text-sage hover:underline">
              特定商取引法に基づく表記
            </Link>
          </li>
          <li>
            <a
              href="mailto:hello@yorisoi.community"
              className="text-sage hover:underline"
            >
              お問い合わせ (hello@yorisoi.community)
            </a>
          </li>
        </ul>
      </section>

      {/* ログアウト */}
      <section className="rounded-2xl border border-wabi bg-white/70 p-5">
        <h2 className="text-sm font-semibold text-ink">セッション</h2>
        <form action="/auth/sign-out" method="POST" className="mt-3">
          <button
            type="submit"
            className="rounded-full border border-wabi px-4 py-1.5 text-sm text-sumi hover:bg-sage/5"
          >
            ログアウト
          </button>
        </form>
      </section>

      {/* 危険な操作 */}
      <section className="rounded-2xl border border-red-200 bg-red-50/40 p-5">
        <h2 className="text-sm font-semibold text-red-800">
          アカウントの削除
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-sumi">
          アカウントを削除すると、ニックネーム・プロフィール・投稿・うなずき
          などすべてのデータが削除されます。この操作は取り消せません。
        </p>
        <p className="mt-3 text-xs text-sumi">
          削除をご希望の場合は{" "}
          <a
            href="mailto:hello@yorisoi.community?subject=アカウント削除依頼"
            className="text-red-700 underline"
          >
            hello@yorisoi.community
          </a>{" "}
          までご連絡ください。本人確認後、48時間以内に対応します。
        </p>
      </section>
    </div>
  );
}
