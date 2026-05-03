"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

/**
 * 危機表現が検知された時に投稿者本人にだけ表示する
 * 優しい呼びかけカード。投稿は隠さない (本人の感情は否定しない)。
 */
export function CrisisCareCard({
  severity,
  onClose,
}: {
  severity: "high" | "medium" | "low";
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="crisis-title"
      onClick={onClose}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-cream p-6 shadow-xl outline-none"
      >
        <div className="text-center">
          <div aria-hidden className="text-4xl">🌿</div>
          <h2
            id="crisis-title"
            className="mt-3 font-display text-xl text-ink"
          >
            投稿してくれて、ありがとう
          </h2>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-sumi">
          あなたの気持ちを書いてくれたこと、受け取りました。
          {severity === "high" ? (
            <>
              今、ひとりで抱えていませんか？
              <br />
              もしよかったら、24時間つながる相談先があります。
            </>
          ) : severity === "medium" ? (
            <>
              つらい気持ちが続いているように感じました。
              <br />
              もしよかったら、相談先を見てみてください。
            </>
          ) : (
            <>
              もしよかったら、相談先のページもあります。
            </>
          )}
        </p>

        <div className="mt-6 space-y-2">
          <Link
            href="/resources"
            onClick={onClose}
            className="block rounded-full bg-sakura/80 px-5 py-3 text-center text-sm font-semibold text-cream hover:bg-sakura"
          >
            🆘 助けが必要な方へ
          </Link>

          {severity === "high" && (
            <a
              href="tel:0120279338"
              className="block rounded-full border border-sakura/40 bg-white px-5 py-3 text-center text-sm font-semibold text-sakura hover:bg-sakura/5"
            >
              📞 よりそいホットライン (0120-279-338)
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="block w-full rounded-full px-5 py-2.5 text-center text-xs text-sumi/70 hover:text-sumi"
          >
            そっと閉じる
          </button>
        </div>

        <p className="mt-4 text-center text-[10px] text-sumi/50">
          このメッセージは、あなたの投稿だけが知っています。
          <br />
          他のユーザーには通知されません。
        </p>
      </div>
    </div>
  );
}
