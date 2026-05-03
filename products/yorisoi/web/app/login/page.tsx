import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "ログイン — よりそい",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <a href="/" className="text-sm text-sumi/60 hover:text-sage">
        ← よりそい
      </a>

      <h1 className="mt-8 font-display text-4xl text-ink">ログイン</h1>
      <p className="mt-3 text-sm leading-relaxed text-sumi">
        メールアドレスを入力すると、ログインリンクをお送りします。
        <br />
        パスワードは不要です。
      </p>

      <Suspense
        fallback={
          <div className="mt-12 text-sm text-sumi/60">読み込み中…</div>
        }
      >
        <LoginForm />
      </Suspense>

      <p className="mt-12 text-center text-xs leading-relaxed text-sumi/60">
        ログインすることで、
        <a href="/legal/terms" className="text-sage underline">利用規約</a>
        と
        <a href="/legal/privacy" className="text-sage underline">プライバシーポリシー</a>
        に同意したものとみなします。
      </p>
    </main>
  );
}
