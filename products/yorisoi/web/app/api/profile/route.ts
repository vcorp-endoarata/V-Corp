import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  nickname: z.string().trim().min(1).max(30).optional(),
  prefecture: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  bio: z.string().max(200).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
});

export async function PATCH(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "未ログインです" }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success || Object.keys(parsed.data).length === 0) {
    return NextResponse.json(
      { error: "入力内容が正しくありません" },
      { status: 400 },
    );
  }

  // Only include fields that were explicitly sent
  const update: Record<string, unknown> = {};
  if (parsed.data.nickname !== undefined) update.nickname = parsed.data.nickname;
  if (parsed.data.prefecture !== undefined)
    update.prefecture = parsed.data.prefecture;
  if (parsed.data.city !== undefined) update.city = parsed.data.city;
  if (parsed.data.bio !== undefined) update.bio = parsed.data.bio;
  if (parsed.data.avatar_url !== undefined)
    update.avatar_url = parsed.data.avatar_url;

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "そのニックネームは既に使われています" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
