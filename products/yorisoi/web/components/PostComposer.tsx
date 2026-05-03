"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "feeling", label: "🌥 気持ち" },
  { value: "worry", label: "💭 悩み" },
  { value: "experience", label: "✨ 体験" },
  { value: "question", label: "❓ 質問" },
  { value: "celebration", label: "🌱 お祝い" },
  { value: "diary", label: "📝 日記" },
] as const;

export function PostComposer({
  defaultSpace,
  role,
}: {
  defaultSpace: "self" | "family" | "shared";
  role: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]["value"]>("diary");
  const [space, setSpace] = useState<"self" | "family" | "shared">(defaultSpace);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;

    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ body: body.trim(), category, space }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "投稿できませんでした");
        setBody("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが起きました");
      }
    });
  }

  const ownSpaces = role === "self" ? ["self", "shared"] : ["family", "shared"];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-wabi bg-white/60 p-4"
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="いま、どんな気持ち?"
        maxLength={500}
        rows={3}
        className="w-full resize-none rounded-xl border border-transparent bg-transparent p-2 text-base text-ink outline-none placeholder:text-ink/40 focus:border-sage/40"
        aria-label="投稿本文"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-wabi/60 pt-3">
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="rounded-full border border-wabi bg-white px-3 py-1 text-xs text-sumi outline-none focus:border-sage"
            aria-label="カテゴリー"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={space}
            onChange={(e) => setSpace(e.target.value as typeof space)}
            className="rounded-full border border-wabi bg-white px-3 py-1 text-xs text-sumi outline-none focus:border-sage"
            aria-label="どこに投稿するか"
          >
            {ownSpaces.map((s) => (
              <option key={s} value={s}>
                {s === "self"
                  ? "🌱 当事者の場"
                  : s === "family"
                    ? "🤲 身近な人の場"
                    : "🌅 みんなの場"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-sumi/50">{body.length} / 500</span>
          <button
            type="submit"
            disabled={!body.trim() || isPending}
            className="rounded-full bg-sage px-5 py-1.5 text-sm font-semibold text-cream transition hover:opacity-90 disabled:opacity-40"
          >
            {isPending ? "送信中…" : "投稿"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
