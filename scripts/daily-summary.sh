#!/usr/bin/env bash
# scripts/daily-summary.sh — Build & post the V-Corp daily summary to Discord.
#
# Sources currently aggregated:
#   • Stripe: subscriptions / payments / balance (requires STRIPE_API_KEY)
#   • Git:    commits in the last 24h on the current branch
#
# Usage:
#   ./scripts/daily-summary.sh              # post to Discord
#   ./scripts/daily-summary.sh --dry-run    # print to stdout only
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
[[ -f "$ROOT/.env" ]] && { set -a; . "$ROOT/.env"; set +a; }

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

JST_DATE="$(TZ=Asia/Tokyo date '+%Y-%m-%d (%a)')"

# ---- Stripe section ----
stripe_section() {
  if [[ -z "${STRIPE_API_KEY:-}" ]]; then
    echo "_Stripe: STRIPE_API_KEY 未設定のためスキップ_"
    return
  fi

  local balance subs_active subs_trial revenue_today
  balance=$(curl -s -u "${STRIPE_API_KEY}:" \
    https://api.stripe.com/v1/balance \
    | jq -r '[.available[]?.amount] | add // 0')
  subs_active=$(curl -s -u "${STRIPE_API_KEY}:" \
    "https://api.stripe.com/v1/subscriptions?status=active&limit=100" \
    | jq -r '.data | length')
  subs_trial=$(curl -s -u "${STRIPE_API_KEY}:" \
    "https://api.stripe.com/v1/subscriptions?status=trialing&limit=100" \
    | jq -r '.data | length')
  local since
  since=$(date -d 'yesterday 00:00 UTC' +%s 2>/dev/null || date -u -v-1d +%s)
  revenue_today=$(curl -s -u "${STRIPE_API_KEY}:" \
    "https://api.stripe.com/v1/charges?created[gte]=${since}&limit=100" \
    | jq -r '[.data[] | select(.paid==true and .refunded==false) | .amount] | add // 0')

  cat <<EOF
**Stripe**
- Active subs: ${subs_active}
- Trialing:    ${subs_trial}
- Today's revenue: ¥${revenue_today}
- Available balance: ¥${balance}
EOF
}

# ---- Git section ----
git_section() {
  cd "$ROOT"
  local count log
  count=$(git log --since='24 hours ago' --oneline | wc -l | tr -d ' ')
  log=$(git log --since='24 hours ago' --pretty=format:'• %h %s' | head -10)
  cat <<EOF
**Engineering**
- Commits (24h): ${count}
${log:-• (no commits)}
EOF
}

REPORT="$(cat <<EOF
:rocket: **V-Corp Daily Summary — ${JST_DATE} JST**

$(stripe_section)

$(git_section)

— posted by scripts/daily-summary.sh
EOF
)"

if (( DRY_RUN )); then
  echo "$REPORT"
else
  echo "$REPORT" | "$ROOT/scripts/notify.sh" --title "Daily Summary" --body-file /dev/stdin
fi
