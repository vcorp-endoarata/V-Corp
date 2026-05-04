import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const Body = z.object({
  body: z.string().trim().min(1).max(500),
  category: z.enum([
    "feeling",
    "worry",
    "experience",
    "question",
    "celebration",
    "diary",
  ]),
  space: z.enum(["self", "family", "shared"]),
});

export async function POST(req: Request) {
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
    return NextResponse.json({ error: "入力内容が正しくありません" }, { status: 400 });
  }

  // role と space の整合性チェック (RLS でも弾かれるが UX のため事前)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile) {
    return NextResponse.json({ error: "プロフィールがありません" }, { status: 400 });
  }
  if (parsed.data.space === "self" && profile.role !== "self") {
    return NextResponse.json(
      { error: "「当事者の場」には投稿できません" },
      { status: 403 },
    );
  }
  if (
    parsed.data.space === "family" &&
    profile.role !== "family" &&
    profile.role !== "supporter"
  ) {
    return NextResponse.json(
      { error: "「身近な人の場」には投稿できません" },
      { status: 403 },
    );
  }

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      space: parsed.data.space,
      body: parsed.data.body,
      category: parsed.data.category,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
