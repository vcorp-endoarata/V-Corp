import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileEditForm } from "@/components/ProfileEditForm";

export const metadata = {
  title: "プロフィール編集 — よりそい",
  robots: { index: false, follow: false },
};

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nickname, role, prefecture, city, bio")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/onboarding");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-ink">プロフィール編集</h1>
      <ProfileEditForm
        initial={{
          nickname: profile.nickname,
          prefecture: profile.prefecture,
          city: profile.city,
          bio: profile.bio,
        }}
      />
    </div>
  );
}
