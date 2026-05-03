import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic link / Email confirmation コールバック。
 *
 * Supabase Auth は project 設定によって2種類のフローを送る:
 *   - PKCE フロー  → ?code=xxx           → exchangeCodeForSession()
 *   - OTP フロー   → ?token_hash=xxx     → verifyOtp()
 *
 * 両方をハンドルする。
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") ?? "/feed";
  const origin = url.origin;

  // Supabase が error を URL params で返すケース (期限切れ等)
  const errorCode = url.searchParams.get("error_code");
  const errorDescription = url.searchParams.get("error_description");
  if (errorCode) {
    const msg =
      errorCode === "otp_expired"
        ? "ログインリンクの有効期限が切れています。もう一度お送りします。"
        : (errorDescription ?? errorCode);
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(msg)}`,
    );
  }

  const supabase = await createClient();

  if (code) {
    // PKCE flow
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`,
      );
    }
  } else if (tokenHash && type) {
    // OTP / magic link flow
    const { error } = await supabase.auth.verifyOtp({
      type: type as
        | "signup"
        | "magiclink"
        | "recovery"
        | "invite"
        | "email_change"
        | "email",
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`,
      );
    }
  } else {
    return NextResponse.redirect(`${origin}/login?error=missing_token`);
  }

  // profiles 行存在チェック
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.redirect(`${origin}/onboarding`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
