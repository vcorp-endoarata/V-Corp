"use client";
import { useState, useTransition } from "react";

export function UnazukiButton({
  postId,
  initialCount,
  initialActive,
  disabled = false,
}: {
  postId: string;
  initialCount: number;
  initialActive: boolean;
  disabled?: boolean;
}) {
  const [count, setCount] = useState(initialCount);
  const [active, setActive] = useState(initialActive);
  const [isPending, startTransition] = useTransition();
  const [flash, setFlash] = useState<string | null>(null);

  function toggle() {
    if (disabled) return;
    const wasActive = active;
    setActive(!wasActive);
    setCount((c) => (wasActive ? Math.max(c - 1, 0) : c + 1));

    startTransition(async () => {
      const res = await fetch(`/api/empathy/${postId}`, {
        method: wasActive ? "DELETE" : "POST",
      });
      if (!res.ok) {
        setActive(wasActive);
        setCount((c) => (wasActive ? c + 1 : Math.max(c - 1, 0)));
        return;
      }
      setFlash(wasActive ? "解除しました" : "✓ うなずきました");
      setTimeout(() => setFlash(null), 1500);
    });
  }

  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || isPending}
        title={
          disabled
            ? "自分の投稿にはうなずけません"
            : active
              ? "うなずきを取り消す"
              : "うなずく"
        }
        aria-pressed={active}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition ${
          active
            ? "bg-sage text-cream"
            : "text-sumi hover:bg-sage/10 hover:text-sage"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <span aria-hidden className={active ? "scale-110" : ""}>
          {active ? "🌿" : "🍃"}
        </span>
        <span className="hidden sm:inline">{active ? "うなずき中" : "うなずく"}</span>
        {count > 0 && <span className="text-xs tabular-nums">{count}</span>}
      </button>
      {flash && (
        <span
          role="status"
          className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-sage px-2 py-0.5 text-[10px] text-cream shadow"
        >
          {flash}
        </span>
      )}
    </span>
  );
}
