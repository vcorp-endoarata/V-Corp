const FAQS = [
  {
    q: "AIはどのモデルを使っていますか？",
    a: "Anthropic Claude (Opus / Sonnet) を中心に、用途に応じてモデルを使い分けています。データは学習に使われません。",
  },
  {
    q: "セキュリティは大丈夫ですか？",
    a: "RLS によるテナント分離、保管時/通信時の暗号化、Supabase Auth による MFA、監査ログを実装。Enterprise プランでは ISMS / ISMAP 準拠を進めます。",
  },
  {
    q: "解約はいつでも可能ですか？",
    a: "月額プランはいつでも解約可能。年額・Lifetime はクーリングオフ期間 (14日) 内であれば全額返金。",
  },
  {
    q: "請求書払い (請求書対応) はできますか？",
    a: "Business / Enterprise プランで対応。請求書発行・銀行振込・年間契約に対応します。",
  },
  {
    q: "オンプレ提供は可能ですか？",
    a: "Enterprise プランでオンプレ / プライベートクラウド / VPC ピアリングに対応します。お問い合わせください。",
  },
];

export function FAQ() {
  return (
    <section className="border-t border-white/10 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-display text-3xl md:text-4xl">よくある質問</h2>
        <div className="mt-12 divide-y divide-white/10">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-left text-base font-medium text-white/90">
                {f.q}
                <span className="ml-4 text-white/40 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/65">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
