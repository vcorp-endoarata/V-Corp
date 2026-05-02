import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-24 text-center">
        <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs tracking-wide text-white/70">
          🚀 2026 Q2 ローンチ予定 / Founder Lifetime 先着100名
        </span>
        <h1 className="mt-8 font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
          経営判断を、<span className="text-accent">AI で 10倍速く。</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
          毎朝3分。AI が市場・競合・自社の数字を読み解き、
          <br className="hidden md:block" />
          今日の意思決定に必要な「3つのアクション」を提示します。
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="#pricing"
            className="glow rounded-full bg-accent px-7 py-3 text-base font-semibold text-ink transition hover:opacity-90"
          >
            プランを見る
          </Link>
          <Link
            href="#waitlist"
            className="rounded-full border border-white/20 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/5"
          >
            ウェイトリスト登録
          </Link>
        </div>
        <p className="mt-6 text-sm text-white/40">
          14日間の無料トライアル / カード登録不要 / いつでも解約
        </p>
      </div>
    </section>
  );
}
