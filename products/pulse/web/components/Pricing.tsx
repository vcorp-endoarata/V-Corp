const PLANS = [
  {
    name: "Starter",
    seats: "1アカウント",
    monthly: 2980,
    yearly: 29800,
    features: [
      "AI Daily Briefing",
      "月10件までのオンデマンドレポート",
      "KPI ダッシュボード基本機能",
    ],
    cta: "Starter で始める",
    href: "#waitlist",
    highlight: false,
  },
  {
    name: "Pro",
    seats: "5アカウントまで",
    monthly: 12800,
    yearly: 128000,
    features: [
      "Starter の全機能",
      "無制限のレポート生成",
      "競合インテリジェンス",
      "Slack / Teams 連携",
    ],
    cta: "Pro で始める",
    href: "#waitlist",
    highlight: true,
  },
  {
    name: "Business",
    seats: "25アカウントまで",
    monthly: 49800,
    yearly: 498000,
    features: [
      "Pro の全機能",
      "API / Webhook",
      "SSO / SAML",
      "専任 CSM",
      "SLA 99.9%",
    ],
    cta: "商談を申し込む",
    href: "#waitlist",
    highlight: false,
  },
];

const fmt = (n: number) => "¥" + n.toLocaleString();

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-white/10 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-display text-3xl md:text-4xl">価格</h2>
        <p className="mt-3 text-center text-white/60">
          年額は月額の 2ヶ月分割引 (約 17% OFF)。すべて税抜。
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                p.highlight
                  ? "glow border-accent/60 bg-ink"
                  : "border-white/10 bg-ink/60"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-[10px] font-bold tracking-wider text-ink">
                  MOST POPULAR
                </span>
              )}
              <h3 className="font-display text-2xl">{p.name}</h3>
              <p className="mt-2 text-sm font-semibold text-accent2">{p.seats}</p>
              <div className="mt-6 min-h-[64px]">
                <span className="font-display text-4xl">{fmt(p.monthly)}</span>
                <span className="text-white/60"> / 月</span>
                <div className="text-xs text-white/40">
                  年額 {fmt(p.yearly)} (17% OFF)
                </div>
              </div>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-white/80">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-accent2">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={p.href}
                className={`mt-8 rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                  p.highlight
                    ? "bg-accent text-ink hover:opacity-90"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-white/50">
          30名以上の組織は、個別プランをご相談ください →{" "}
          <a
            href="mailto:hello@v-corp.inc"
            className="text-accent hover:underline"
          >
            hello@v-corp.inc
          </a>
        </p>
      </div>
    </section>
  );
}
