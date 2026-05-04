"use client";
import { useState, useTransition } from "react";

type A11y = {
  font_size: "small" | "medium" | "large";
  reduce_motion: boolean;
  high_contrast: boolean;
};

const SIZE_OPTIONS = [
  { value: "small", label: "小", sample: "text-sm" },
  { value: "medium", label: "標準", sample: "text-base" },
  { value: "large", label: "大", sample: "text-lg" },
] as const;

export function AccessibilityForm({ initial }: { initial: A11y }) {
  const [a11y, setA11y] = useState<A11y>(initial);
  const [isPending, startTransition] = useTransition();
  const [savedKey, setSavedKey] = useState<keyof A11y | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof A11y>(key: K, value: A11y[K]) {
    setA11y({ ...a11y, [key]: value });

    startTransition(async () => {
      setError(null);
      try {
        const res = await fetch("/api/profile/preferences", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ [key]: value }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "保存できませんでした");
        setSavedKey(key);
        setTimeout(() => setSavedKey(null), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが起きました");
      }
    });
  }

  return (
    <div className="space-y-3">
      {/* フォントサイズ */}
      <div className="rounded-xl border border-wabi bg-white/40 p-3">
        <label className="block">
          <span className="flex items-center justify-between text-sm font-semibold text-ink">
            <span>文字の大きさ</span>
            {savedKey === "font_size" && (
              <span className="text-xs text-sage" role="status">
                ✓ 保存しました
              </span>
            )}
          </span>
          <span className="mt-1 block text-xs leading-relaxed text-sumi/70">
            読みやすい大きさを選んでください
          </span>
          <div className="mt-3 flex gap-2">
            {SIZE_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => update("font_size", o.value)}
                disabled={isPending}
                aria-pressed={a11y.font_size === o.value}
                className={`flex-1 rounded-lg border px-3 py-2 transition ${
                  a11y.font_size === o.value
                    ? "border-sage bg-sage/10 text-ink"
                    : "border-wabi bg-white text-sumi hover:bg-sage/5"
                }`}
              >
                <span className={`block ${o.sample}`}>{o.label}</span>
              </button>
            ))}
          </div>
        </label>
      </div>

      {/* アニメーション削減 */}
      <div className="rounded-xl border border-wabi bg-white/40 p-3">
        <label className="flex cursor-pointer items-start justify-between gap-3">
          <span className="flex-1">
            <span className="block text-sm font-semibold text-ink">
              アニメーションを減らす
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-sumi/70">
              点滅・回転などの動きを最小化します。
              発作・チック誘発が心配な方に推奨。
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2 pt-0.5">
            {savedKey === "reduce_motion" && (
              <span className="text-xs text-sage" role="status">
                ✓ 保存しました
              </span>
            )}
            <input
              type="checkbox"
              checked={a11y.reduce_motion}
              onChange={(e) => update("reduce_motion", e.target.checked)}
              disabled={isPending}
              className="h-5 w-5 cursor-pointer accent-sage"
            />
          </span>
        </label>
      </div>

      {/* 高コントラスト */}
      <div className="rounded-xl border border-wabi bg-white/40 p-3">
        <label className="flex cursor-pointer items-start justify-between gap-3">
          <span className="flex-1">
            <span className="block text-sm font-semibold text-ink">
              高コントラスト表示
            </span>
            <span className="mt-1 block text-xs leading-relaxed text-sumi/70">
              文字と背景のコントラストを強くします。読みやすさが向上。
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2 pt-0.5">
            {savedKey === "high_contrast" && (
              <span className="text-xs text-sage" role="status">
                ✓ 保存しました
              </span>
            )}
            <input
              type="checkbox"
              checked={a11y.high_contrast}
              onChange={(e) => update("high_contrast", e.target.checked)}
              disabled={isPending}
              className="h-5 w-5 cursor-pointer accent-sage"
            />
          </span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
