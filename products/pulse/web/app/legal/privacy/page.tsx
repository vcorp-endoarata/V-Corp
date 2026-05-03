export const metadata = {
  title: "プライバシーポリシー — V-Corp Pulse",
  robots: { index: false, follow: false },
};

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "1. 事業者情報",
    body: (
      <>
        本ポリシーにおける「当事業者」とは、屋号 V-Corp (販売事業者: 遠藤 新大、所在地:
        〒134-0088 東京都江戸川区西葛西3丁目16番20号 ペルシェール西葛西309) をいいます。
      </>
    ),
  },
  {
    title: "2. 取得する個人情報",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>氏名 / メールアドレス / 電話番号 / 所属組織名 (登録時)</li>
        <li>クレジットカード情報 (Stripe 経由で処理し、当事業者のサーバーには保存しません)</li>
        <li>本サービスの利用ログ (アクセス日時、操作内容、IPアドレス、Cookie 等)</li>
        <li>お問い合わせ時にご提供いただく情報</li>
        <li>その他、本サービスの提供に必要な情報</li>
      </ul>
    ),
  },
  {
    title: "3. 利用目的",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>本サービスの提供・運用・保守</li>
        <li>本人確認、認証、利用料金の請求</li>
        <li>サービス改善・新機能開発のための統計分析</li>
        <li>重要なお知らせ、メンテナンス情報、機能更新の通知</li>
        <li>キャンペーン情報・新サービス案内 (利用者の同意がある場合のみ)</li>
        <li>不正利用の検知および対応</li>
        <li>お問い合わせへの対応</li>
        <li>法令に基づく開示・対応</li>
      </ul>
    ),
  },
  {
    title: "4. 第三者提供",
    body: (
      <>
        当事業者は、利用者の同意がある場合または法令に基づく場合を除き、取得した個人情報を
        第三者に提供しません。ただし、利用目的の達成に必要な範囲で、以下の業務委託先に
        個人情報の取扱いを委託することがあります:
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Stripe Inc. (クレジットカード決済)</li>
          <li>Supabase (DB / 認証基盤)</li>
          <li>Vercel Inc. (ウェブホスティング)</li>
          <li>Anthropic, PBC (AI 処理。データはモデル学習に利用されません)</li>
        </ul>
      </>
    ),
  },
  {
    title: "5. 安全管理措置",
    body: (
      <>
        当事業者は、取得した個人情報の漏洩、滅失、毀損の防止その他安全管理のため、
        合理的な技術的・組織的安全管理措置を講じます。具体的には、保管時および通信時の
        暗号化、アクセス権限の最小化、監査ログの取得、定期的なセキュリティレビューを
        実施しています。
      </>
    ),
  },
  {
    title: "6. Cookie および類似技術の使用",
    body: (
      <>
        本サービスでは、利用状況の把握、認証維持、サービス改善のため Cookie および
        類似技術を使用することがあります。ブラウザ設定により Cookie を無効にできますが、
        その場合一部機能が利用できなくなることがあります。
      </>
    ),
  },
  {
    title: "7. 開示・訂正・削除請求",
    body: (
      <>
        利用者は、当事業者が保有する自己の個人情報について、開示、訂正、追加、削除、
        利用停止、第三者提供の停止を請求できます。請求にあたっては、下記お問い合わせ先まで
        ご連絡ください。当事業者は、本人確認の上、合理的な期間内に対応します。
      </>
    ),
  },
  {
    title: "8. 海外への移転",
    body: (
      <>
        本サービスは、米国・EU 等の海外に所在するクラウド事業者を業務委託先として
        利用する場合があります。当該移転は GDPR 等の各法令に準拠した形で行われます。
      </>
    ),
  },
  {
    title: "9. 改定",
    body: (
      <>
        当事業者は、必要に応じて本ポリシーを改定することがあります。重要な変更がある場合、
        利用者へ通知するか、本ページにて告知します。
      </>
    ),
  },
  {
    title: "10. お問い合わせ窓口",
    body: (
      <div className="space-y-1">
        <p>個人情報に関するお問い合わせ:</p>
        <p>
          メール:{" "}
          <a href="mailto:hello@v-corp.inc" className="text-accent hover:underline">
            hello@v-corp.inc
          </a>
        </p>
        <p>事業者: 遠藤 新大 (屋号: V-Corp)</p>
      </div>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <a href="/" className="text-sm text-white/50 hover:text-white">← V-Corp Pulse</a>
      <h1 className="mt-6 font-display text-4xl text-white md:text-5xl">
        プライバシーポリシー
      </h1>
      <p className="mt-4 text-sm text-white/50">最終更新日: 2026年5月3日</p>

      <div className="mt-12 space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-xl text-white">{s.title}</h2>
            <div className="mt-3 text-sm leading-relaxed text-white/75">{s.body}</div>
          </section>
        ))}
      </div>

      <p className="mt-16 text-xs text-white/40">制定日: 2026年5月3日</p>

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
