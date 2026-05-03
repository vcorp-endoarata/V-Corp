import { CheckoutButton } from "@/components/CheckoutButton";
import { WaitlistForm } from "@/components/WaitlistForm";

const FOUNDER_LIFETIME_PRICE_ID = "price_1TSewYCwVQEZ2XFqv4afuJc5";

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
          <CheckoutButton
            priceId={FOUNDER_LIFETIME_PRICE_ID}
            mode="payment"
            label="今すぐ Founder Lifetime を購入する"
            loadingLabel="決済画面に移動中…"
            className="glow inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-semibold text-ink transition hover:opacity-90 disabled:opacity-50"
          />
          <p className="mt-3 text-xs text-white/40">
            Stripe 決済 / 14日以内 全額返金保証 / カード・コンビニ・銀行振込対応
          </p>
        </div>
        <div className="mt-12 border-t border-white/10 pt-10">
          <p className="mb-4 text-sm text-white/60">
            まだ検討中の方はウェイトリストへ。ローンチ前にご案内します。
          </p>
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
