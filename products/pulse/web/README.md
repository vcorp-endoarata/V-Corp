# V-Corp Pulse — Web (LP + API)

Next.js 15 App Router で構築する V-Corp Pulse の LP + API。

## ローカル起動

```bash
cd products/pulse/web
cp .env.local.example .env.local
# .env.local の値を埋める
npm install
npm run dev
# → http://localhost:3000
```

## 構成

```
web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               LP (Hero/Problem/Features/Pricing/Founder/FAQ/Footer)
│   ├── globals.css
│   └── api/
│       ├── waitlist/route.ts  POST /api/waitlist  (Supabase へインサート)
│       ├── checkout/route.ts  POST /api/checkout  (Stripe Checkout Session 作成)
│       └── webhooks/stripe/route.ts  POST /api/webhooks/stripe  (Discord 通知)
├── components/                LP の UI コンポーネント
├── lib/
│   ├── supabase.ts            service-role クライアント
│   └── discord.ts             Discord Webhook ヘルパ
└── package.json
```

## Vercel デプロイ

1. Vercel ダッシュボードで `vcorp-pulse-web` プロジェクトを作成 (このディレクトリを Root に設定)
2. 環境変数を設定:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `DISCORD_WEBHOOK_URL`
3. `npm run build` がローカルで通ることを確認してからデプロイ

## Stripe Webhook の繋ぎ込み

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. Endpoint URL: `https://<your-domain>/api/webhooks/stripe`
3. 監視イベント:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Signing secret を `STRIPE_WEBHOOK_SECRET` に設定

## 注意事項

- **livemode の Stripe** を直接叩くため、ローカル開発でも実マネーが動く可能性あり。
  テストには Stripe CLI の `--api-key sk_test_...` を別途利用する。
- Supabase の `service_role` キーは絶対に `NEXT_PUBLIC_*` にしない。
