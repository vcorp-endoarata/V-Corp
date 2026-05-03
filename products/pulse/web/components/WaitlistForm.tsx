"use client";
import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "登録に失敗しました");
      setState("success");
      setMessage("登録しました。ローンチ前にメールでご案内します。");
      setEmail("");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "登録に失敗しました");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-accent"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="whitespace-nowrap rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink transition hover:opacity-90 disabled:opacity-50"
        >
          {state === "loading" ? "送信中…" : "ウェイトリストに登録"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            state === "error" ? "text-red-400" : "text-accent2"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
