import { WaitlistForm } from "@/components/WaitlistForm";

export function Founder() {
  return (
    <section id="waitlist" className="py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-xs tracking-wider text-accent">
          先着 100 名・期間限定
        </span>
        <h2 className="mt-6 font-display text-4xl md:text-5xl">
          Founder Lifetime <span className="text-accent">¥298,000</span>
        </h2>
        <p className="mt-4 text-white/70">
          Pro プランの全機能を <strong>生涯</strong> 利用可能。
          月額換算でおよそ 4ヶ月分 (年額換算で 2.3年分) のお支払いで、
          以降の追加課金は永久にゼロ。
        </p>
        <ul className="mx-auto mt-8 inline-block text-left text-sm text-white/80">
          <li className="flex gap-3">
            <span className="text-accent2">✓</span> Pro プランの全機能を生涯
          </li>
          <li className="flex gap-3">
            <span className="text-accent2">✓</span> 創業期サポーター殿堂入り (LP掲載・希望者のみ)
          </li>
          <li className="flex gap-3">
            <span className="text-accent2">✓</span> 機能リクエスト優先対応
          </li>
          <li className="flex gap-3">
            <span className="text-accent2">✓</span> CEO 直接 Slack チャネル招待
          </li>
        </ul>
        <div className="mt-12">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
