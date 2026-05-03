import { NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

export const runtime = "nodejs";

const Body = z.object({
  priceId: z.string().min(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export async function POST(req: Request) {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) return NextResponse.json({ error: "not configured" }, { status: 500 });
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid payload" }, { status: 400 });

  const stripe = new Stripe(apiKey);
  const origin = req.headers.get("origin") ?? "https://pulse.v-corp.io";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: parsed.data.priceId, quantity: 1 }],
    success_url: parsed.data.successUrl ?? `${origin}/thanks?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: parsed.data.cancelUrl ?? `${origin}/#pricing`,
    allow_promotion_codes: true,
    automatic_tax: { enabled: true },
  });

  return NextResponse.json({ url: session.url });
}
