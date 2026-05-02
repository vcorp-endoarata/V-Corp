/**
 * Discord webhook helper.
 * Reads DISCORD_WEBHOOK_URL from env and posts a message.
 * Errors are logged but never thrown — notifications are best-effort.
 */
const WEBHOOK = process.env.DISCORD_WEBHOOK_URL;

export async function notifyDiscord(content: string, opts?: { username?: string }) {
  if (!WEBHOOK) {
    console.warn("[discord] DISCORD_WEBHOOK_URL is not set; skipping notify");
    return;
  }
  try {
    const res = await fetch(WEBHOOK, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        content: content.length > 1900 ? content.slice(0, 1900) + "…(truncated)" : content,
        username: opts?.username ?? "V-Corp Bot",
      }),
    });
    if (!res.ok) {
      console.warn("[discord] webhook failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (e) {
    console.warn("[discord] webhook error:", e);
  }
}
