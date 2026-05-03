import Link from "next/link";

export const metadata = {
  title: "ご購入ありがとうございます — V-Corp Pulse",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-24">
      <div className="max-w-2xl text-center">
        <span className="rounded-full bg-accent/10 px-4 py-1 text-xs tracking-wider text-accent">
          DONE
        </span>
        <h1 className="mt-8 font-display text-5xl md:text-6xl">
          ありがとうございます。
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/70">
          Founder Lifetime のご購入を承りました。<br />
          お支払い確認後、ローンチ前に専用の招待リンクを<br />
          ご登録のメールアドレスへお送りします。
        </p>
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left text-sm text-white/70">
          <p className="font-semibold text-white">これからのご案内</p>
          <ul className="mt-4 space-y-2">
            <li className="flex gap-3">
              <span className="text-accent2">①</span>
              <span>領収書が即時自動送信されます</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent2">②</span>
              <span>CEO 直通 Slack チャネル招待を別途お送りします (24時間以内)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent2">③</span>
              <span>創業期サポーター殿堂入りご希望の方は <a className="text-accent underline" href="mailto:hello@v-corp.inc">hello@v-corp.inc</a> までお名前/お写真を</span>
            </li>
          </ul>
        </div>
        <Link
          href="/"
          className="mt-12 inline-block rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
        >
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
