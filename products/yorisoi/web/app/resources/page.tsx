import Link from "next/link";

export const metadata = {
  title: "助けが必要な方へ — よりそい",
  description:
    "つらい気持ち・自殺・自傷の衝動を感じたら、ひとりで抱え込まないでください。24時間つながる相談窓口があります。",
  robots: { index: true, follow: true },
};

const RESOURCES = [
  {
    name: "よりそいホットライン",
    tel: "0120-279-338",
    desc: "24時間 / 通話無料 / 全国対応 / 全ての悩み",
    note: "外国語・性別の悩み・震災関連 等の専門ガイドあり",
  },
  {
    name: "いのちの電話",
    tel: "0570-783-556",
    desc: "10:00-22:00 / 月10日のみフリーダイヤルあり",
    note: "深夜は地域別の番号 (https://www.inochinodenwa.org)",
  },
  {
    name: "こころのほっとチャット (LINE)",
    tel: null,
    url: "https://www.npo-jpf.org/notice/sns",
    desc: "LINE / Twitter で相談 / 匿名OK",
    note: "全国精神保健福祉会連合会",
  },
  {
    name: "チャイルドライン",
    tel: "0120-99-7777",
    desc: "16:00-21:00 / 18歳まで対象 / 通話無料",
    note: "日曜日除く毎日",
  },
  {
    name: "発達障害者支援センター",
    tel: null,
    url: "https://www.rehab.go.jp/ddis/",
    desc: "各都道府県に設置 / 平日昼間 / 専門相談",
    note: "発達障害特化、家族相談も可",
  },
  {
    name: "保健所・精神保健福祉センター",
    tel: null,
    url: "https://www.mhlw.go.jp/kokoro/support/",
    desc: "お住まいの自治体 / 平日昼間 / 無料",
    note: "緊急性が高い場合は警察(110) or 救急(119) も選択肢",
  },
];

export default function ResourcesPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <a href="/" className="text-sm text-sumi/60 hover:text-sage">
        ← よりそい
      </a>

      <h1 className="mt-6 font-display text-3xl text-ink md:text-4xl">
        助けが必要な方へ
      </h1>

      <div className="mt-6 rounded-2xl border-2 border-sakura/40 bg-sakura/10 p-5 text-sm leading-relaxed text-ink">
        <p>
          <strong>つらい気持ち、自分や誰かを傷つけたい衝動、消えてしまいたい気持ち。</strong>
        </p>
        <p className="mt-3">
          ひとりで抱え込まないでください。
          <br />
          下記の窓口は、すべて<strong>匿名でつながり、安全</strong>です。
        </p>
        <p className="mt-3 text-xs text-sumi/80">
          🚨 命に危険が迫っている場合は、迷わず{" "}
          <a href="tel:119" className="font-semibold text-red-700 underline">
            119
          </a>{" "}
          (救急) または{" "}
          <a href="tel:110" className="font-semibold text-red-700 underline">
            110
          </a>{" "}
          (警察) に電話してください。
        </p>
      </div>

      <ul className="mt-8 space-y-4">
        {RESOURCES.map((r) => (
          <li
            key={r.name}
            className="rounded-2xl border border-wabi bg-white/70 p-5"
          >
            <h2 className="font-display text-lg text-ink">{r.name}</h2>
            <p className="mt-2 text-sm text-sumi">{r.desc}</p>
            {r.note && (
              <p className="mt-1 text-xs text-sumi/70">{r.note}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              {r.tel && (
                <a
                  href={`tel:${r.tel.replace(/-/g, "")}`}
                  className="rounded-full bg-sage px-4 py-1.5 text-sm font-semibold text-cream"
                >
                  📞 {r.tel}
                </a>
              )}
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-sage/40 px-4 py-1.5 text-sm text-sage hover:bg-sage/5"
                >
                  詳細サイトへ ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 rounded-2xl border border-wabi bg-white/40 p-5 text-sm leading-relaxed text-sumi">
        <p>
          <strong>よりそい</strong> は、コミュニティアプリです。
          医療や緊急対応の専門機関ではないため、
          深刻な状況の場合は必ず上記の窓口にもご連絡ください。
        </p>
        <p className="mt-3 text-xs">
          このページは{" "}
          <Link href="/" className="text-sage underline">
            よりそいトップ
          </Link>
          、
          <Link href="/feed" className="text-sage underline">
            フィード
          </Link>
          、設定 から いつでも開けます。
        </p>
      </div>
    </main>
  );
}
