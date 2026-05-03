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
    .select("id, nickname, role, is_admin")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) redirect("/onboarding");

  return (
    <div className="min-h-screen">
      <AppHeader
        nickname={profile.nickname}
        role={profile.role}
        isAdmin={profile.is_admin}
      />
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-4 md:pt-8">{children}</div>
    </div>
  );
}
