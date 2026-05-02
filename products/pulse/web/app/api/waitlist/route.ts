import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { notifyDiscord } from "@/lib/discord";

const Body = z.object({
  email: z.string().email(),
  source: z.string().optional(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  const { email, source } = parsed.data;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "server not configured" }, { status: 500 });
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { error } = await supabase
    .from("waitlist")
    .insert({
      email,
      source: source ?? "lp",
      referrer: req.headers.get("referer"),
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await notifyDiscord(`📨 Waitlist 新規登録: \`${email}\` (source: ${source ?? "lp"})`).catch(
    () => void 0,
  );

  return NextResponse.json({ ok: true });
}
