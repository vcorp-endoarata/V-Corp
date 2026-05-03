"use client";
import { useState } from "react";

type Mode = "subscription" | "payment";

export function CheckoutButton({
  priceId,
  mode = "subscription",
  label,
  loadingLabel = "Stripe へ移動中…",
  className,
}: {
  priceId: string;
  mode?: Mode;
  label: string;
  loadingLabel?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ priceId, mode }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "決済画面の作成に失敗しました");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-center">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={className}
      >
        {loading ? loadingLabel : label}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
