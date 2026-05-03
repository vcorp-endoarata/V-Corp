import { WaitlistForm } from "@/components/WaitlistForm";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <span className="rounded-full border border-sage/40 bg-sage/10 px-4 py-1 text-xs tracking-wider text-sage">
        2026年 オープン準備中
      </span>

      <h1 className="mt-8 font-display text-5xl leading-[1.15] tracking-tight md:text-7xl">
        よりそい
      </h1>

      <p className="mt-4 font-display text-base text-sumi md:text-lg">
        発達障害に悩む人々の <span className="text-sage">安らぎ</span> の場
      </p>

      <p className="mx-auto mt-12 max-w-xl text-sm leading-relaxed text-sumi md:text-base">
        ADHD・ASD・トゥレット症候群 など、発達障害を持つ人と、
        <br />
        その家族・身近な人たちが、
        <br className="hidden md:block" />
        比較せず、攻撃せず、ただ <strong>寄り添える</strong> 場所を作っています。
      </p>

      <div className="mx-auto mt-12 max-w-md rounded-2xl border border-wabi bg-white/40 p-6 text-left text-sm leading-relaxed text-sumi">
        <p className="font-semibold text-ink">大切にしている設計</p>
        <ul className="mt-3 space-y-2 text-xs">
          <li className="flex gap-2">
            <span className="text-sage">◇</span>
            <span>「いいね」ボタンはありません — 比較はしない</span>
          </li>
          <li className="flex gap-2">
            <span className="text-sage">◇</span>
            <span>「うなずき」「共感」「共有」 — 静かな反応だけ</span>
          </li>
          <li className="flex gap-2">
            <span className="text-sage">◇</span>
            <span>当事者の場 / 家族の場 — 必要に応じて分かれます</span>
          </li>
          <li className="flex gap-2">
            <span className="text-sage">◇</span>
            <span>半匿名 — ニックネームで、本音で書ける</span>
          </li>
          <li className="flex gap-2">
            <span className="text-sage">◇</span>
            <span>攻撃的な発言には、しっかり対応します</span>
          </li>
        </ul>
      </div>

      <div className="mt-16">
        <p className="mb-4 text-xs text-sumi">
          オープンしたら、メールでお知らせします。
        </p>
        <WaitlistForm />
      </div>

      <footer className="mt-24 text-xs text-sumi/60">
        <p>運営: V-Corp / 遠藤 新大</p>
        <p className="mt-2 space-x-3">
          <a href="/legal/tokutei" className="hover:text-sage">特定商取引法</a>
          <a href="/legal/terms" className="hover:text-sage">利用規約</a>
          <a href="/legal/privacy" className="hover:text-sage">プライバシー</a>
          <a href="mailto:hello@yorisoi.community" className="hover:text-sage">
            お問い合わせ
          </a>
        </p>
      </footer>
    </main>
  );
}
