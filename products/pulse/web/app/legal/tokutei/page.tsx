export const metadata = {
  title: "特定商取引法に基づく表記 — V-Corp Pulse",
  robots: { index: false, follow: false },
};

const ROWS: [string, React.ReactNode][] = [
  ["販売事業者の名称", "遠藤 新大 (屋号: V-Corp)"],
  ["運営責任者", "遠藤 新大"],
  [
    "所在地",
    "〒134-0088 東京都江戸川区西葛西3丁目16番20号 ペルシェール西葛西309",
  ],
  ["電話番号", "070-9198-3232"],
  [
    "受付時間",
    "平日 10:00 - 18:00 (土日祝・年末年始を除く)。お急ぎでない場合はメールフォームをご利用ください",
  ],
  [
    "メールアドレス",
    <a key="m" className="text-accent hover:underline" href="mailto:hello@v-corp.inc">
      hello@v-corp.inc
    </a>,
  ],
  [
    "販売価格",
    "各サービス紹介ページに表示の通り (すべて税抜表示。別途消費税を申し受けます)",
  ],
  [
    "商品代金以外の必要料金",
    "消費税 (10%) / お客様の利用環境に応じた通信費 / 銀行振込時の振込手数料 (お客様負担)",
  ],
  [
    "支払方法",
    "クレジットカード決済 (Stripe Inc. を通じて Visa / Mastercard / JCB / American Express / Diners Club に対応)",
  ],
  [
    "支払時期",
    "月額・年額プラン: 申込時、および各更新日に自動課金。Founder Lifetime プラン: 注文確定時に一括課金",
  ],
  [
    "商品の引渡時期 (役務提供時期)",
    "決済完了後、即時にサービスへのアクセス権を発行します",
  ],
  [
    "返品・キャンセル",
    "ソフトウェアサービスの性質上、決済完了後の返品・キャンセルは原則お受けできません。ただし以下の例外を設けます: (1) Founder Lifetime プラン: 購入後14日以内に限り、未使用の場合に全額返金します。(2) 当社の責に帰すべき重大な不具合等が発生した場合: 個別にご相談の上、適切に対応いたします。",
  ],
  [
    "動作環境",
    "最新版の Google Chrome / Mozilla Firefox / Safari / Microsoft Edge、および主要モバイルブラウザ",
  ],
];

export default function TokuteiPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <a href="/" className="text-sm text-white/50 hover:text-white">← V-Corp Pulse</a>
      <h1 className="mt-6 font-display text-4xl text-white md:text-5xl">
        特定商取引法に基づく表記
      </h1>
      <p className="mt-4 text-sm text-white/50">最終更新日: 2026年5月3日</p>

      <dl className="mt-12 divide-y divide-white/10 border-y border-white/10">
        {ROWS.map(([term, def]) => (
          <div
            key={term}
            className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[220px,1fr] md:gap-6"
          >
            <dt className="text-sm font-semibold text-white">{term}</dt>
            <dd className="text-sm leading-relaxed text-white/75">{def}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-12 text-xs leading-relaxed text-white/40">
        本表記は特定商取引に関する法律 (昭和51年法律第57号) 第11条および
        同法施行規則第8条に基づき表示しています。
      </p>

      <div className="mt-12 text-center">
        <a
          href="/"
          className="inline-block rounded-full border border-white/20 px-6 py-2.5 text-sm text-white transition hover:bg-white/5"
        >
          ホームに戻る
        </a>
      </div>
    </main>
  );
}
