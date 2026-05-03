export function Problem() {
  const items = [
    { stat: "3.2 時間", label: "経営者が毎日「情報収集と整理」に費やす時間" },
    { stat: "67%", label: "「KPIは見えているが何を決めればよいか分からない」と回答した経営者" },
    { stat: "20 時間", label: "中堅企業の経営企画が月次の取締役会資料作成に費やす時間" },
  ];
  return (
    <section className="border-t border-white/10 bg-white/[0.02] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-center font-display text-3xl md:text-4xl">
          ダッシュボードはある。
          <br className="md:hidden" />
          でも「答え」はない。
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.label} className="rounded-2xl border border-white/10 bg-ink/60 p-6">
              <div className="font-display text-4xl text-accent">{it.stat}</div>
              <p className="mt-3 text-white/70">{it.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
