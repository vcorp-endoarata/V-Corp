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

  function toggle() {
    if (disabled) return;
    const wasActive = active;
    // optimistic update
    setActive(!wasActive);
    setCount((c) => (wasActive ? Math.max(c - 1, 0) : c + 1));

    startTransition(async () => {
      const res = await fetch(`/api/empathy/${postId}`, {
        method: wasActive ? "DELETE" : "POST",
      });
      if (!res.ok) {
        // revert on failure
        setActive(wasActive);
        setCount((c) => (wasActive ? c + 1 : Math.max(c - 1, 0)));
      }
    });
  }

  return (
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
      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition ${
        active
          ? "bg-sage/15 text-sage"
          : "text-sumi hover:bg-sage/10 hover:text-sage"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <span aria-hidden className={active ? "scale-110" : ""}>
        {active ? "🌿" : "🍃"}
      </span>
      <span>うなずき</span>
      {count > 0 && <span className="text-xs tabular-nums">{count}</span>}
    </button>
  );
}
