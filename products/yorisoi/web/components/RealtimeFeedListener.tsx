"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RealtimeFeedListener({
  space,
  currentUserId,
}: {
  space: string;
  currentUserId: string;
}) {
  const router = useRouter();
  const [newCount, setNewCount] = useState(0);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`feed:${space}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts",
          filter: `space=eq.${space}`,
        },
        (payload) => {
          const np = payload.new as {
            author_id?: string;
            status?: string;
          };
          if (np.author_id === currentUserId) return;
          if (np.status && np.status !== "published") return;
          setNewCount((c) => c + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [space, currentUserId]);

  if (newCount === 0) return null;

  return (
    <button
      type="button"
      onClick={() => {
        setNewCount(0);
        startTransition(() => router.refresh());
      }}
      className="sticky top-16 z-10 mx-auto block rounded-full bg-sage px-5 py-2 text-xs font-semibold text-cream shadow-md transition hover:opacity-90"
      aria-label={`新着の投稿が ${newCount} 件あります`}
    >
      🌱 新着 {newCount} 件 — 表示する
    </button>
  );
}
