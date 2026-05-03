import { NextResponse } from "next/server";
import Stripe from "stripe";
import { notifyDiscord } from "@/lib/discord";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!sig || !secret || !apiKey) {
    return NextResponse.json({ error: "not configured" }, { status: 500 });
  }

  const body = await req.text();
  const stripe = new Stripe(apiKey);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "invalid signature" },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const amount = (s.amount_total ?? 0).toLocaleString();
      const email = s.customer_details?.email ?? "(no email)";
      await notifyDiscord(
        `💰 **新規決済成立** ¥${amount}\n顧客: \`${email}\`\nmode: ${s.mode}\nsession: ${s.id}`,
      );
      break;
    }
    case "customer.subscription.created": {
      const sub = event.data.object as Stripe.Subscription;
      await notifyDiscord(
        `📝 **新規サブスク開始** ${sub.id}\nstatus: ${sub.status}\nprice: ${sub.items.data[0]?.price.id}`,
      );
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await notifyDiscord(`⚠️ **サブスク解約** ${sub.id}`);
      break;
    }
    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice;
      await notifyDiscord(
        `🚨 **支払い失敗** invoice ${inv.id} amount ¥${(inv.amount_due ?? 0).toLocaleString()}`,
      );
      break;
    }
    default:
      // No-op for events we don't care about yet.
      break;
  }

  return NextResponse.json({ received: true });
}
