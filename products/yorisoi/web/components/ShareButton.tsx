"use client";
import { useState } from "react";

export function ShareButton({
  text,
  url,
}: {
  text: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    const shareData = { text, url };
    // Web Share API (モバイル中心、対応してれば優先)
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // ユーザーがキャンセル等、フォールバックへ
      }
    }
    // フォールバック: URL コピー
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 何もできない場合は開く
      const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(tweet, "_blank");
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title="共有"
      aria-label="共有"
      className="flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-sumi transition hover:bg-sage/10 hover:text-sage"
    >
      <span aria-hidden>↗</span>
      <span>{copied ? "コピー済" : "共有"}</span>
    </button>
  );
}
