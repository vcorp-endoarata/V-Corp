import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { detectCrisis } from "@/lib/crisis-detect";

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
  if (
    parsed.data.space === "self" &&
    profile.role !== "self"
  ) {
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

  // 危機表現を検知 (投稿は隠さず、本人にだけ後で相談先を提示)
  const crisis = detectCrisis(parsed.data.body);

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      space: parsed.data.space,
      body: parsed.data.body,
      category: parsed.data.category,
      crisis_detected: crisis.detected,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 危機検知時: crisis_events に記録 (admin client で書き込み)
  if (crisis.detected) {
    const admin = createAdminClient();
    await admin.from("crisis_events").insert({
      user_id: user.id,
      post_id: data.id,
      ai_response: { severity: crisis.severity, matched: crisis.matched },
      resources_shown: ["yorisoi_hotline", "inochi_no_denwa", "kokoro_chat"],
    });
  }

  return NextResponse.json({
    ok: true,
    id: data.id,
    crisis_detected: crisis.detected,
    crisis_severity: crisis.severity,
  });
}
