# V-Corp — User Actions Required

> 私 (Claude) がコネクタ経由で代行できないため、**あなた** に一度だけ実施いただきたい設定リスト。
> 完了したら `[x]` でチェックしてください。

## ✅ 完了済み (Claude / ユーザー協働)

- [x] Supabase Pro プラン契約 (V-Corp org)
- [x] Supabase MCP 再認証 → V-Corp org が見える状態に
- [x] Supabase プロジェクト `vcorp-pulse` 作成 ($10/月、ap-northeast-1)
- [x] Supabase スキーマ apply (`tenants`, `users`, `subscriptions`, `briefings`, `reports`, `waitlist` 等 9テーブル + RLS)
- [x] Stripe 6商品 / 9価格を作成 (livemode)
- [x] Discord Webhook URL 設定 → `notify.sh` / `daily-summary.sh` 動作確認
- [x] Next.js LP の雛形 + API ルート (`/api/waitlist`, `/api/checkout`, `/api/webhooks/stripe`) 作成

## 🔴 即時必須 (収益化に直結)

- [ ] **Stripe ビジネス詳細を入力** ([products/pulse/docs/STRIPE_SETUP.md](./products/pulse/docs/STRIPE_SETUP.md) のコピペ用ガイド参照)
  - Public business name = `V-Corp`
  - Statement descriptor = `VCORP`
  - Industry = Software / MCC `7372`
  - 本人確認 (KYC): 実情報を入力
- [ ] **Stripe Webhook エンドポイント設定**  
  Dashboard → Developers → Webhooks → Add endpoint → `https://<domain>/api/webhooks/stripe`  
  `customer.subscription.*`, `invoice.payment_*`, `checkout.session.completed` を購読 → Signing secret を取得

## 🟡 高優先 (LP 公開まで)

- [ ] **Vercel プロジェクト作成** (`vcorp-pulse-web`)  
  Root: `products/pulse/web` / Framework: Next.js 15 (auto-detect)
- [ ] **Vercel に環境変数を設定** ([products/pulse/web/.env.local.example](./products/pulse/web/.env.local.example) と同じキー):
  - `NEXT_PUBLIC_SUPABASE_URL=https://ueurwfnwhxwkkqbweysh.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...` (Supabase Dashboard → Project Settings → API)
  - `SUPABASE_SERVICE_ROLE_KEY=...` (同上、service_role キー)
  - `STRIPE_SECRET_KEY=sk_live_...` / `STRIPE_WEBHOOK_SECRET=whsec_...`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
  - `DISCORD_WEBHOOK_URL=...`
- [ ] **ドメイン取得** + Vercel に紐付け: `pulse.v-corp.io` 等  
  → 取得後、CNAME 設定

## 🟢 中優先 (ローンチ前後)

- [ ] **Anthropic API Key を発行** → Vercel Env に追加 (`ANTHROPIC_API_KEY`)  
  https://console.anthropic.com/settings/keys
- [ ] **GitHub Actions Secret 設定** (`Settings → Secrets and variables → Actions`):
  - `DISCORD_WEBHOOK_URL` (日次サマリー用)
  - `STRIPE_API_KEY` (read-only restricted key)
- [ ] **Postmark / Resend アカウント開設** (顧客向けトランザクションメール)
- [ ] **特商法表記ページ** (LP の `/legal/tokutei`)
- [ ] **プライバシーポリシー / 利用規約** (LP の `/legal/privacy`, `/legal/terms`)

## 🔵 低優先 (スケール時)

- [ ] **法人設立** (もしまだなら): V-Corp 株式会社 として登記
- [ ] **インボイス登録番号取得**
- [ ] **ISMS / ISO27001 / ISMAP 準備** (Enterprise 顧客向け)

---

## 私 (Claude) が今すぐ進められること

上記が揃わなくても、以下は引き続き実施できます:

- Stripe 製品 / 価格の追加・調整
- Supabase スキーマ追加 (Edge Function、cron、追加テーブル)
- LP のコピー磨き込み・追加コンポーネント
- GTM コンテンツ (note 記事、X 投稿草稿、プレスリリース)
- 運用スクリプト (CI、リリース、監視) の追加
- Stripe Business Name 設定後 → 全価格に Payment Link 発行 + LP 反映

**「次これやって」と指示するだけで、即実行します。**
