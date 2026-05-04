import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "はじめる / ログイン — よりそい",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // 既ログイン済みなら適切なページへ (Supabase 不通でも login 画面は表示)
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
      redirect(profile ? "/feed" : "/onboarding");
    }
  } catch (err) {
    // Next.js redirect() は throw するので、redirect 例外は再 throw
    if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    console.error("[login] Supabase error:", err);
    // Supabase 不通でも login 画面は表示
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <a href="/" className="text-sm text-sumi/60 hover:text-sage">
        ← よりそい
      </a>

      <h1 className="mt-8 font-display text-4xl text-ink">はじめる / ログイン</h1>
      <p className="mt-3 text-sm leading-relaxed text-sumi">
        メールアドレスを入力すると、リンクを送ります。
        <br />
        <strong>はじめての方</strong>はリンクをタップで自動で
        アカウント作成、<strong>既にアカウントがある方</strong>は
        そのままログインできます。
      </p>
      <p className="mt-3 rounded-xl bg-sage/5 px-4 py-2 text-xs leading-relaxed text-sumi/80">
        パスワードはありません。毎回メールでログインリンクをお送りする方式です。
        覚える必要が無く、ハッキングされにくい仕組みです。
      </p>

      <Suspense
        fallback={
          <div className="mt-12 text-sm text-sumi/60">読み込み中…</div>
        }
      >
        <LoginForm />
      </Suspense>

      <p className="mt-12 text-center text-xs leading-relaxed text-sumi/60">
        続行することで、
        <a href="/legal/terms" className="text-sage underline">利用規約</a>
        と
        <a href="/legal/privacy" className="text-sage underline">プライバシーポリシー</a>
        に同意したものとみなします。
      </p>
    </main>
  );
}
