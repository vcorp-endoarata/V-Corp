"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CrisisCareCard } from "@/components/CrisisCareCard";

type CrisisSeverity = "high" | "medium" | "low";

export function ReplyComposer({ postId }: { postId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [crisisSeverity, setCrisisSeverity] = useState<CrisisSeverity | null>(
    null,
  );

  const remaining = 500 - body.length;
  const disabled = body.trim().length === 0 || isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setError(null);

    const res = await fetch(`/api/posts/${postId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });

    const data = (await res.json().catch(() => null)) as
      | {
          error?: string;
          crisis_detected?: boolean;
          crisis_severity?: CrisisSeverity;
        }
      | null;

    if (!res.ok) {
      setError(data?.error ?? "返信を投稿できませんでした");
      return;
    }

    setBody("");
    startTransition(() => router.refresh());

    if (
      data?.crisis_detected &&
      (data.crisis_severity === "high" || data.crisis_severity === "medium")
    ) {
      setCrisisSeverity(data.crisis_severity);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="reply-body" className="sr-only">
        返信を書く
      </label>
      <textarea
        id="reply-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="そっと返事を書く…"
        rows={3}
        maxLength={500}
        className="w-full rounded-2xl border border-wabi bg-white/80 px-4 py-3 text-sm text-ink placeholder:text-sumi/50 focus:border-sage focus:outline-none focus:ring-1 focus:ring-sage"
      />
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs ${
            remaining < 0
              ? "text-sakura"
              : remaining < 50
                ? "text-sumi"
                : "text-sumi/60"
          }`}
        >
          残り {remaining} 字
        </span>
        <button
          type="submit"
          disabled={disabled}
          className="rounded-full bg-sage px-5 py-1.5 text-sm font-semibold text-cream disabled:bg-sage/30"
        >
          {isPending ? "送信中…" : "返信する"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-sakura">
          {error}
        </p>
      )}

      {crisisSeverity && (
        <CrisisCareCard
          severity={crisisSeverity}
          onClose={() => setCrisisSeverity(null)}
        />
      )}
    </form>
  );
}
