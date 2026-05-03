#!/usr/bin/env bash
# scripts/notify.sh — Post a message to V-Corp Discord channel via Webhook.
#
# Usage:
#   ./scripts/notify.sh "<message>"
#   echo "<message>" | ./scripts/notify.sh
#   ./scripts/notify.sh --title "Daily Summary" --body-file ./tmp/report.md
#
# Required env:
#   DISCORD_WEBHOOK_URL    Discord channel webhook URL
# Optional env:
#   DISCORD_USERNAME       Sender display name (default: "V-Corp Bot")
#   DISCORD_AVATAR_URL     Avatar override URL
set -euo pipefail

if [[ -f "${BASH_SOURCE%/*}/../.env" ]]; then
  set -a; . "${BASH_SOURCE%/*}/../.env"; set +a
fi

if [[ -z "${DISCORD_WEBHOOK_URL:-}" ]]; then
  echo "ERROR: DISCORD_WEBHOOK_URL is not set. Add it to .env or export it." >&2
  exit 1
fi

USERNAME="${DISCORD_USERNAME:-V-Corp Bot}"
AVATAR_URL="${DISCORD_AVATAR_URL:-}"

TITLE=""
BODY=""
BODY_FILE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title) TITLE="$2"; shift 2 ;;
    --body-file) BODY_FILE="$2"; shift 2 ;;
    --) shift; BODY="$*"; break ;;
    *) BODY="${BODY}${BODY:+ }$1"; shift ;;
  esac
done

if [[ -n "$BODY_FILE" ]]; then
  BODY="$(cat "$BODY_FILE")"
elif [[ -z "$BODY" && ! -t 0 ]]; then
  BODY="$(cat)"
fi

if [[ -z "$BODY" && -z "$TITLE" ]]; then
  echo "ERROR: provide a message body (arg, stdin, or --body-file)." >&2
  exit 1
fi

# Discord allows max 2000 chars per content; truncate safely.
MAX=1900
if (( ${#BODY} > MAX )); then
  BODY="${BODY:0:$MAX}…(truncated)"
fi

CONTENT=""
[[ -n "$TITLE" ]] && CONTENT="**${TITLE}**"$'\n'
CONTENT="${CONTENT}${BODY}"

PAYLOAD=$(jq -n \
  --arg c "$CONTENT" \
  --arg u "$USERNAME" \
  --arg a "$AVATAR_URL" \
  '{content: $c, username: $u} + (if $a != "" then {avatar_url: $a} else {} end)')

curl --silent --show-error --fail \
  -H "Content-Type: application/json" \
  -X POST \
  -d "$PAYLOAD" \
  "$DISCORD_WEBHOOK_URL" >/dev/null

echo "✓ posted to Discord"
