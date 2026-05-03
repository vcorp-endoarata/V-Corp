"use client";

import { useState } from "react";
import { getPublicUrl } from "@/lib/storage";

type Media = {
  id: string;
  kind: "image" | "video";
  storage_path: string;
  width?: number | null;
  height?: number | null;
  blurred?: boolean | null;
};

export function PostMediaDisplay({ media }: { media: Media[] }) {
  if (!media || media.length === 0) return null;

  const isSingle = media.length === 1;
  const gridClass = isSingle
    ? "grid grid-cols-1"
    : media.length === 2
      ? "grid grid-cols-2 gap-1"
      : "grid grid-cols-2 gap-1";

  return (
    <div className={`mt-3 overflow-hidden rounded-xl ${gridClass}`}>
      {media.map((m) => (
        <MediaItem key={m.id} m={m} cover={!isSingle} />
      ))}
    </div>
  );
}

function MediaItem({ m, cover }: { m: Media; cover: boolean }) {
  const [revealed, setRevealed] = useState(!m.blurred);
  const url = getPublicUrl(m.storage_path);

  const aspectClass = cover ? "aspect-square" : "max-h-[600px]";
  const imgClass = cover
    ? "h-full w-full object-cover"
    : "h-auto max-h-[600px] w-full object-contain";

  return (
    <figure
      className={`relative overflow-hidden bg-cream ${aspectClass}`}
    >
      {m.kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          loading="lazy"
          className={`${imgClass} ${
            revealed ? "" : "scale-110 blur-2xl"
          } transition`}
          width={m.width ?? undefined}
          height={m.height ?? undefined}
        />
      ) : (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          className={`${imgClass} ${revealed ? "" : "scale-110 blur-2xl"}`}
        />
      )}

      {!revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-cream"
          aria-label="ぼかしを解除して表示する"
        >
          <span aria-hidden className="text-2xl">👁</span>
          <span className="mt-1 text-xs">タップして表示</span>
        </button>
      )}
    </figure>
  );
}
