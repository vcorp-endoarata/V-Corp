import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/AppHeader";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, nickname, role, is_admin, font_size, reduce_motion, high_contrast",
    )
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");

  // 未読通知数 (RLS で本人のみ取得可)
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .is("read_at", null);

  // a11y 設定を class として付与 (globals.css で対応する CSS 定義)
  const a11yClasses = [
    profile.font_size === "small"
      ? "text-[14px]"
      : profile.font_size === "large"
        ? "text-[18px]"
        : "text-[16px]",
    profile.reduce_motion ? "motion-reduce-on" : "",
    profile.high_contrast ? "high-contrast-on" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`min-h-screen ${a11yClasses}`}>
      <AppHeader
        nickname={profile.nickname}
        role={profile.role}
        isAdmin={profile.is_admin}
        unreadNotifications={unreadCount ?? 0}
      />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 md:pt-8">{children}</div>
    </div>
  );
}
