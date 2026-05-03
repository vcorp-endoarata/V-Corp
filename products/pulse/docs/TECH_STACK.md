# V-Corp Pulse — Technical Architecture

## 1. ハイレベル構成

```
┌──────────────┐    ┌─────────────┐    ┌──────────────┐
│ Next.js 15   │───▶│ Edge API    │───▶│ Anthropic    │
│ (Vercel)     │    │ (Hono on    │    │ Claude API   │
│ - LP / App   │    │ Vercel Edge)│    └──────────────┘
└──────┬───────┘    └─────┬───────┘
       │                  │
       │            ┌─────▼─────┐  ┌────────────┐
       └───────────▶│ Supabase  │◀─│ Stripe     │
                    │ (Pro plan)│  │ Webhooks   │
                    │  Postgres │  └────────────┘
                    │  Auth     │
                    │  Storage  │
                    │  Realtime │
                    └───────────┘
```

## 2. スタック詳細

| レイヤー | 採用技術 | 理由 |
| --- | --- | --- |
| Frontend | Next.js 15 (App Router) + Tailwind v4 + shadcn/ui | 開発速度・デザインシステム |
| Hosting | Vercel (Pro) | エッジ、PR Preview、DX |
| API | Next.js Route Handlers / Hono on Vercel Edge | 低レイテンシ |
| DB | Supabase Postgres 17 (V-Corp Pro org) | RLS、Realtime、Auth 統合 |
| Auth | Supabase Auth (magic link + Google OAuth) | 摩擦最小 |
| Storage | Supabase Storage | レポート/添付 |
| Payments | Stripe Checkout + Customer Portal + Webhooks | 王道 |
| LLM | Anthropic Claude (Opus 4.7 / Sonnet 4.6) | 推論品質 |
| Background Jobs | Supabase Edge Functions + pg_cron | サーバレス |
| Observability | Vercel Analytics + Logflare + Sentry | エラー検知 |
| CI/CD | GitHub Actions + Vercel | PR Preview 自動 |
| Notifications | Discord Webhook (社内) / Postmark (顧客) | 二系統 |

## 3. コアフロー

### 3.1 サインアップ → トライアル開始
1. ユーザー LP → Sign up (magic link)
2. Supabase Auth がユーザー作成 → トリガで `tenants` + `users` 行作成
3. Stripe Checkout (trial 14日) でカード登録
4. Webhook `customer.subscription.created` 受信 → `subscriptions` 行作成
5. アプリにリダイレクト → オンボーディング (KPI登録)

### 3.2 Daily Briefing 生成
- pg_cron が毎朝 06:30 JST に各テナントごとに Edge Function を呼ぶ
- Edge Function:
  1. 直近24時間の KPI を集計
  2. Claude API に「3行ブリーフ + 今日のアクション3つ」を要求 (prompt cached)
  3. `briefings` テーブルに保存
  4. ユーザー設定に応じて Postmark / Slack / Teams へ配信

### 3.3 オンデマンドレポート
- ユーザーがチャットUIで指示
- API → Claude (extended thinking, tool use)
- 進行中ステータスを Realtime で UI に push
- 完成したら `reports.output_md` に保存

## 4. セキュリティ

- **すべての DB アクセスは RLS 経由** (匿名キーでも安全)
- **シークレット管理**: Vercel Env Vars + Supabase Secrets
- **暗号化**: 保管時 (Supabase) + 通信 (TLS1.3)
- **監査ログ**: `audit_logs` テーブル + Supabase 監査
- **MFA**: Supabase Auth で TOTP/Passkey
- **将来**: ISMS/ISO27001 → ISMAP

## 5. コスト想定 (月次, 1,000テナント時)

| 項目 | 月額 |
| --- | --- |
| Vercel Pro | $20 + edge add-ons ¥3,000 ≈ ¥6,000 |
| Supabase Pro | $25 ≈ ¥3,800 |
| Anthropic API | (キャッシュ込) ¥600,000 |
| Postmark | ¥10,000 |
| Sentry | ¥5,000 |
| その他SaaS | ¥30,000 |
| **合計** | **約 ¥655,000** |

ARR 1,000 テナント × 平均 ¥80,000 = ¥80,000,000/年 → **粗利率 90%+**。

## 6. 採用予定オープンソース

- `shadcn/ui`, `lucide-react`, `tailwind`, `radix-ui`, `zod`, `drizzle-orm`, `react-hook-form`, `vercel/ai`, `tanstack/query`

## 7. 環境

| 環境 | 用途 | URL |
| --- | --- | --- |
| local | 開発 | http://localhost:3000 |
| preview | PR ごとの自動プレビュー | *.vercel.app |
| production | 本番 | pulse.v-corp.io (要ドメイン取得) |
