"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MediaUploader } from "@/components/MediaUploader";
import { uploadFile } from "@/lib/storage";

const CATEGORIES = [
  { value: "feeling", label: "🌥 気持ち" },
  { value: "worry", label: "💭 悩み" },
  { value: "experience", label: "✨ 体験" },
  { value: "question", label: "❓ 質問" },
  { value: "celebration", label: "🌱 お祝い" },
  { value: "diary", label: "📝 日記" },
] as const;

export function PostComposer({
  defaultSpace,
  role,
}: {
  defaultSpace: "self" | "family" | "shared";
  role: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<typeof CATEGORIES[number]["value"]>("diary");
  const [space, setSpace] = useState<"self" | "family" | "shared">(defaultSpace);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [blurMinors, setBlurMinors] = useState(false);

  const hasMedia = files.length > 0;
  const consentMissing = hasMedia && !consentConfirmed;
  const noContent = body.trim().length === 0 && !hasMedia;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (noContent || consentMissing) return;

    startTransition(async () => {
      setError(null);
      try {
        // 1. Post を作成
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            body: body.trim() || "(写真・動画の投稿)",
            category,
            space,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "投稿できませんでした");

        // 2. Media をアップロード
        if (hasMedia && data.id) {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("認証が切れました");

          for (const file of files) {
            const meta = await uploadFile(supabase, user.id, data.id, file);
            const { error: insertError } = await supabase
              .from("post_media")
              .insert({
                post_id: data.id,
                kind: meta.kind,
                storage_path: meta.storage_path,
                width: meta.width ?? null,
                height: meta.height ?? null,
                bytes: meta.bytes,
                blurred: blurMinors,
                consent_confirmed: true,
              });
            if (insertError) throw insertError;
          }
        }

        // 3. リセット + リフレッシュ
        setBody("");
        setFiles([]);
        setConsentConfirmed(false);
        setBlurMinors(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが起きました");
      }
    });
  }

  const ownSpaces = role === "self" ? ["self", "shared"] : ["family", "shared"];

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-wabi bg-white/60 p-4"
    >
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="いま、どんな気持ち?"
        maxLength={500}
        rows={3}
        className="w-full resize-none rounded-xl border border-transparent bg-transparent p-2 text-base text-ink outline-none placeholder:text-ink/40 focus:border-sage/40"
        aria-label="投稿本文"
      />

      <div className="mt-3 border-t border-wabi/60 pt-3">
        <MediaUploader
          files={files}
          onFilesChange={setFiles}
          disabled={isPending}
        />
      </div>

      {hasMedia && (
        <div className="mt-3 space-y-2 rounded-xl bg-sage/5 p-3">
          <label className="flex items-start gap-2 text-xs text-sumi">
            <input
              type="checkbox"
              checked={consentConfirmed}
              onChange={(e) => setConsentConfirmed(e.target.checked)}
              className="mt-0.5 accent-sage"
            />
            <span>
              <strong className="text-ink">写っている人全員の同意を得ました</strong>
              <br />
              本人の同意がない投稿は削除・通報の対象になります。
            </span>
          </label>

          <label className="flex items-start gap-2 text-xs text-sumi">
            <input
              type="checkbox"
              checked={blurMinors}
              onChange={(e) => setBlurMinors(e.target.checked)}
              className="mt-0.5 accent-sage"
            />
            <span>
              未成年が写っているので <strong>ぼかし表示</strong> にする
              <span className="text-sumi/60"> (推奨)</span>
            </span>
          </label>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-wabi/60 pt-3">
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as typeof category)}
            className="rounded-full border border-wabi bg-white px-3 py-1 text-xs text-sumi outline-none focus:border-sage"
            aria-label="カテゴリー"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={space}
            onChange={(e) => setSpace(e.target.value as typeof space)}
            className="rounded-full border border-wabi bg-white px-3 py-1 text-xs text-sumi outline-none focus:border-sage"
            aria-label="どこに投稿するか"
          >
            {ownSpaces.map((s) => (
              <option key={s} value={s}>
                {s === "self"
                  ? "🌱 当事者の場"
                  : s === "family"
                    ? "🤲 身近な人の場"
                    : "🌅 みんなの場"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-sumi/50">{body.length} / 500</span>
          <button
            type="submit"
            disabled={noContent || consentMissing || isPending}
            title={
              consentMissing
                ? "写真・動画を投稿するには同意確認が必要です"
                : undefined
            }
            className="rounded-full bg-sage px-5 py-1.5 text-sm font-semibold text-cream transition hover:opacity-90 disabled:opacity-40"
          >
            {isPending ? "送信中…" : "投稿"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
