"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CrisisReviewButton({
  crisisId,
  reviewed,
}: {
  crisisId: string;
  reviewed: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  async function submit(markReviewed: boolean) {
    const res = await fetch(`/api/admin/crisis/${crisisId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reviewed: markReviewed,
        note: note.trim() || null,
      }),
    });
    if (res.ok) {
      setShowNote(false);
      setNote("");
      startTransition(() => router.refresh());
    }
  }

  if (reviewed) {
    return (
      <button
        type="button"
        onClick={() => submit(false)}
        disabled={isPending}
        className="text-xs text-sumi/60 hover:underline disabled:opacity-50"
      >
        確認を取り消す
      </button>
    );
  }

  if (!showNote) {
    return (
      <button
        type="button"
        onClick={() => setShowNote(true)}
        className="rounded-full bg-sage px-4 py-1.5 text-xs font-semibold text-cream hover:opacity-90"
      >
        確認した
      </button>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="メモ (任意): 個別連絡 / 経過観察 等"
        maxLength={500}
        className="flex-1 rounded-full border border-wabi bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-sage"
      />
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => {
            setShowNote(false);
            setNote("");
          }}
          className="rounded-full px-3 py-1.5 text-xs text-sumi hover:underline"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={() => submit(true)}
          disabled={isPending}
          className="rounded-full bg-sage px-4 py-1.5 text-xs font-semibold text-cream disabled:opacity-50"
        >
          {isPending ? "保存中…" : "保存"}
        </button>
      </div>
    </div>
  );
}
