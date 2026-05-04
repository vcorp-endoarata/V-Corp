"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Relation = {
  target_id: string;
  kind: "block" | "mute";
  target: {
    id: string;
    nickname: string;
  };
};

export function RelationsList({ relations }: { relations: Relation[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  if (relations.length === 0) {
    return (
      <p className="text-xs text-sumi/60">
        ブロックまたはミュート中のユーザーはいません。
      </p>
    );
  }

  async function unblock(targetId: string, kind: "block" | "mute") {
    const id = `${targetId}-${kind}`;
    setPendingId(id);
    try {
      const res = await fetch(
        `/api/users/${targetId}/relation?kind=${kind}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        startTransition(() => router.refresh());
      } else {
        alert("解除に失敗しました");
      }
    } finally {
      setPendingId(null);
    }
  }

  return (
    <ul className="space-y-2">
      {relations.map((r) => {
        const id = `${r.target_id}-${r.kind}`;
        return (
          <li
            key={id}
            className="flex items-center justify-between rounded-xl border border-wabi bg-white/40 p-3"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-full bg-sumi/10 px-2 py-0.5 text-xs text-sumi">
                {r.kind === "block" ? "🚫 ブロック" : "🔇 ミュート"}
              </span>
              <Link
                href={`/user/${r.target_id}`}
                className="text-ink hover:underline"
              >
                {r.target.nickname}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => unblock(r.target_id, r.kind)}
              disabled={pendingId === id}
              className="text-xs text-sumi hover:text-sage disabled:opacity-50"
            >
              {pendingId === id ? "解除中…" : "解除"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
