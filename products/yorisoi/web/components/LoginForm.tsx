"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/feed";

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        shouldCreateUser: true,
      },
    });

    if (err) {
      setState("error");
      setError(err.message);
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div
        className="mt-12 rounded-2xl border border-sage/40 bg-sage/5 p-6 text-sm leading-relaxed text-ink"
        role="status"
      >
        <p className="font-semibold text-sage">メールを送信しました</p>
        <p className="mt-3">
          <strong>{email}</strong> 宛にログインリンクを送りました。
          メールを開いて、リンクをクリックしてください。
        </p>
        <p className="mt-3 text-xs text-sumi/70">
          メールが届かない場合は、迷惑メールフォルダもご確認ください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-12 space-y-4">
      <label className="block text-sm font-semibold text-ink">
        メールアドレス
        <input
          type="email"
          required
          autoFocus
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state === "sending"}
          className="mt-2 block w-full rounded-2xl border border-wabi bg-white px-5 py-3 text-base text-ink outline-none placeholder:text-ink/30 focus:border-sage disabled:opacity-50"
        />
      </label>

      <button
        type="submit"
        disabled={state === "sending" || !email}
        className="w-full rounded-2xl bg-sage px-6 py-3 text-base font-semibold text-cream transition hover:opacity-90 disabled:opacity-50"
      >
        {state === "sending" ? "送信中…" : "ログインリンクを受け取る"}
      </button>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
