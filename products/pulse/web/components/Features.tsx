const FEATURES = [
  {
    title: "AI Daily Briefing",
    desc: "毎朝7:00 配信。市場・競合・自社KPIを3行で要約し、今日のアクション3つを提示。",
    icon: "🌅",
  },
  {
    title: "On-demand Strategy Reports",
    desc: "「競合A社の最新動向」とチャットで指示すれば、15分で20Pレポートを生成。",
    icon: "📑",
  },
  {
    title: "KPI Dashboard + AI 異常検知",
    desc: "売上/原価/CVR等を可視化。数字の「なぜ」を AI が説明。",
    icon: "📊",
  },
  {
    title: "Board Pack Generator",
    desc: "取締役会用エグゼクティブサマリーを自動生成。月次資料作成を 95% 削減。",
    icon: "🗂️",
  },
  {
    title: "Slack / Teams 連携",
    desc: "業務チャットから AI に直接質問。回答もチャットに戻る。",
    icon: "💬",
  },
  {
    title: "Enterprise セキュリティ",
    desc: "ゼロトラスト・SSO/SAML・SLA 99.9%・ISMAP 対応 (Roadmap)。",
    icon: "🔐",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center font-display text-3xl md:text-4xl">
          5本の矢で、経営判断を加速する。
        </h2>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-accent/40"
            >
              <div className="text-3xl">{f.icon}</div>
              <h3 className="mt-4 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
