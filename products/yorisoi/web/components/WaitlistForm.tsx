"use client";
import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"self" | "family" | "supporter" | "">("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, role: role || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "登録に失敗しました");
      setState("success");
      setMessage("登録ありがとうございます。オープン前にお知らせします。");
      setEmail("");
      setRole("");
    } catch (err) {
      setState("error");
      setMessage(
        err instanceof Error ? err.message : "登録に失敗しました",
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "self" | "family" | "supporter" | "")
          }
          className="rounded-2xl border border-wabi bg-white px-4 py-3 text-sm text-ink outline-none focus:border-sage"
        >
          <option value="">あなたの立場 (任意)</option>
          <option value="self">当事者 (発達障害を持っています)</option>
          <option value="family">家族・身近な人</option>
          <option value="supporter">支援者・専門家</option>
        </select>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl border border-wabi bg-white px-5 py-3 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-sage"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="whitespace-nowrap rounded-2xl bg-sage px-6 py-3 text-sm font-semibold text-cream transition hover:opacity-90 disabled:opacity-50"
        >
          {state === "loading" ? "送信中…" : "オープン通知を受け取る"}
        </button>
      </form>
      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            state === "error" ? "text-red-500" : "text-sage"
          }`}
          role="status"
        >
          {message}
        </p>
      )}
    </div>
  );
}
