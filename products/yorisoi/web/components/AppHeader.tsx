import Link from "next/link";

const ROLE_LABEL: Record<string, string> = {
  self: "当事者",
  family: "家族",
  supporter: "支援者",
};

export function AppHeader({
  nickname,
  role,
  isAdmin = false,
}: {
  nickname: string;
  role: string;
  isAdmin?: boolean;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-wabi/60 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/feed" className="font-display text-xl text-ink">
          よりそい
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href="/profile"
            className="flex items-center gap-2 text-sumi hover:text-sage"
          >
            <span className="rounded-full bg-sage/10 px-2 py-0.5 text-xs text-sage">
              {ROLE_LABEL[role] ?? role}
            </span>
            <span className="hidden md:inline">{nickname}</span>
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              aria-label="モデレーション"
              title="モデレーション"
              className="text-sumi hover:text-sage"
            >
              🛡
            </Link>
          )}
          <Link
            href="/settings"
            aria-label="設定"
            className="text-sumi hover:text-sage"
          >
            ⚙
          </Link>
        </div>
      </div>
    </header>
  );
}
