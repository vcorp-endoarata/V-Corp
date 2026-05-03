import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  nickname: z.string().trim().min(1).max(30),
  prefecture: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  bio: z.string().max(200).nullable().optional(),
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
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容が正しくありません" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      nickname: parsed.data.nickname,
      prefecture: parsed.data.prefecture ?? null,
      city: parsed.data.city ?? null,
      bio: parsed.data.bio ?? null,
    })
    .eq("id", user.id);

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
