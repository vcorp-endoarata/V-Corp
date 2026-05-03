import { UnazukiButton } from "@/components/UnazukiButton";
import { ShareButton } from "@/components/ShareButton";
import { ReportButton } from "@/components/ReportButton";

const CATEGORY_LABEL: Record<string, string> = {
  feeling: "🌥 気持ち",
  worry: "💭 悩み",
  experience: "✨ 体験",
  question: "❓ 質問",
  celebration: "🌱 お祝い",
  diary: "📝 日記",
};

const ROLE_LABEL: Record<string, string> = {
  self: "当事者",
  family: "家族",
  supporter: "支援者",
};

type PostCardProps = {
  post: {
    id: string;
    body: string;
    category: string;
    space: string;
    empathy_count: number;
    created_at: string;
    author: {
      id: string;
      nickname: string;
      role: string;
    };
  };
  hasEmpathy: boolean;
  isOwn: boolean;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "たった今";
  if (min < 60) return `${min}分前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}時間前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}日前`;
  const mo = Math.floor(day / 30);
  return `${mo}ヶ月前`;
}

export function PostCard({ post, hasEmpathy, isOwn }: PostCardProps) {
  return (
    <article className="rounded-2xl border border-wabi bg-white/70 p-5">
      <header className="flex items-center justify-between text-xs text-sumi/70">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-ink">{post.author.nickname}</span>
          <span className="rounded-full bg-sage/10 px-2 py-0.5 text-sage">
            {ROLE_LABEL[post.author.role] ?? post.author.role}
          </span>
          <span>•</span>
          <span>{CATEGORY_LABEL[post.category] ?? post.category}</span>
        </div>
        <time dateTime={post.created_at}>{timeAgo(post.created_at)}</time>
      </header>

      <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-ink">
        {post.body}
      </p>

      <footer className="mt-4 flex items-center justify-between gap-1 border-t border-wabi/60 pt-3">
        <div className="flex items-center gap-1">
          <UnazukiButton
            postId={post.id}
            initialCount={post.empathy_count}
            initialActive={hasEmpathy}
            disabled={isOwn}
          />
          <ShareButton
            text={post.body.slice(0, 80) + (post.body.length > 80 ? "…" : "")}
            url={`https://yorisoi.community/post/${post.id}`}
          />
        </div>
        <ReportButton targetType="post" targetId={post.id} disabled={isOwn} />
      </footer>
    </article>
  );
}
