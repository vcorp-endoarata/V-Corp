# V-Corp Deployment Guide

> 本ドキュメントは V-Corp Pulse の本番デプロイ手順を **コピペで完結** できるレベルまで具体化したもの。

| 項目 | 値 |
| --- | --- |
| 本番ドメイン | `v-corp.inc` (お名前.com で取得済み) |
| Git リポジトリ | `MrRG32/V-Corp` (GitHub) |
| Vercel プロジェクト名 | `V-Corp` |
| Vercel Root Directory | `products/pulse/web` |
| Supabase プロジェクト | `vcorp-pulse` (ref: `ueurwfnwhxwkkqbweysh`, region: ap-northeast-1) |
| Stripe | livemode |
| AI | Anthropic Claude Sonnet 4.6 (Daily Briefing) |

---

## ステップ 1. Vercel プロジェクト作成 (約5分)

1. https://vercel.com/new にアクセス
2. **Import Git Repository** で `MrRG32/V-Corp` を選択
3. プロジェクト設定:

   | 項目 | 値 |
   | --- | --- |
   | Project Name | `V-Corp` |
   | Framework Preset | Next.js (自動検出) |
   | Root Directory | **`products/pulse/web`** ⚠️ 必ず設定 |
   | Build Command | `next build` (デフォルトのまま) |
   | Output Directory | `.next` (デフォルトのまま) |
   | Install Command | `npm install` (デフォルトのまま) |
   | Node.js Version | 22.x (デフォルト) |

4. **Environment Variables** をセット (次のセクションを参照)
5. **Deploy** をクリック → 初回ビルド開始 (約2分)

> 初回デプロイは環境変数が完全じゃなくても通る。ただし `/api/checkout` と `/api/webhooks/stripe` は失敗するので、後で全 env を入れること。

---

## ステップ 2. 環境変数 (Production / Preview / Development 全て)

Vercel ダッシュボード → Project → Settings → Environment Variables:

### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://ueurwfnwhxwkkqbweysh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_tjRteYKTI1o_Z62q6aGC3w_yAUTVGfn
SUPABASE_SERVICE_ROLE_KEY=<Supabase Dashboard > Project Settings > API > service_role keyからコピー>
```

### Stripe (livemode)
```
STRIPE_SECRET_KEY=sk_live_...    # Stripe Dashboard > Developers > API keys
STRIPE_WEBHOOK_SECRET=whsec_...  # ステップ4で取得
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Anthropic (Phase 2 で使用)
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Discord Webhook (社内通知)
```
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### サイト URL
```
NEXT_PUBLIC_SITE_URL=https://v-corp.inc
```

> 全変数の Environment は **Production / Preview / Development の3つ全てチェック** 推奨。

---

## ステップ 3. ドメイン `v-corp.inc` を Vercel に接続

### 3a. Vercel 側で追加
1. Vercel Project → Settings → **Domains**
2. `v-corp.inc` を入力 → **Add**
3. `www.v-corp.inc` も入力 → **Add** (apex に301リダイレクト推奨)
4. Vercel が出す DNS レコードをメモ:
   - **A** レコード: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`

### 3b. お名前.com 側で DNS 設定 (推奨方法: Vercel ネームサーバーへ切り替え)

**最速ルート: ネームサーバーを Vercel に委譲**

1. お名前.com Navi にログイン → ドメイン → `v-corp.inc`
2. **ネームサーバーの変更** → 「**その他のネームサーバーを使う**」
3. 以下を入力 (Vercel 公式):
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. 確認 → 反映まで通常 1〜6 時間 (公称 最大 48 時間)
5. Vercel ダッシュボードの Domains に **緑のチェック ✓** が表示されれば完了

> この方式だと SSL 証明書も Vercel が自動発行 (Let's Encrypt)。手動操作不要。

**代替ルート (お名前.com の DNS を継続利用したい場合)**

1. お名前.com Navi → ドメイン → DNS → **DNSレコード設定を利用する**
2. 以下のレコードを追加:

   | ホスト名 | TYPE | VALUE | TTL |
   | --- | --- | --- | --- |
   | (空欄) | A | `76.76.21.21` | 300 |
   | www | CNAME | `cname.vercel-dns.com` | 300 |
   | (空欄) | TXT | `_vercel.<verification-code>` | 300 |

   ※ TXT のverification-code は Vercel ドメイン追加時に画面表示される

---

## ステップ 4. Stripe Webhook 設定 (本番モード)

1. Stripe Dashboard → Developers → **Webhooks** → **Add endpoint**
2. Endpoint URL: `https://v-corp.inc/api/webhooks/stripe`
3. リッスンするイベント:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. 作成後、表示される **Signing secret (whsec_...)** をコピー
5. Vercel の `STRIPE_WEBHOOK_SECRET` 環境変数に貼り付け
6. Vercel で **Redeploy**

---

## ステップ 5. GitHub Actions Secrets 設定

Daily Summary などの自動化ジョブ用に GitHub repo Secret をセット:

1. https://github.com/MrRG32/V-Corp/settings/secrets/actions
2. **New repository secret** で以下を追加:

   | Name | Value 取得元 |
   | --- | --- |
   | `DISCORD_WEBHOOK_URL` | Discord サーバー → Channel Settings → Integrations → Webhooks |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > service_role |
   | `STRIPE_SECRET_KEY` | Stripe livemode の sk_live_... (read-only restricted key 推奨) |
   | `ANTHROPIC_API_KEY` | https://console.anthropic.com → API keys |

3. Workflow 実行確認: `.github/workflows/daily-summary.yml` が手動 dispatch で動くか確認

---

## ステップ 6. クリーンアップ

### 6a. 重複 Supabase プロジェクトの削除
- 古い `V-Corp` Supabase (ref: `ytoyzvdzqdodohknvhks`) は **空** で未使用
- Supabase Dashboard → V-Corp → Settings → General → **Delete project**

### 6b. super-robot との混同防止
- Vercel ダッシュボードで `V-Corp` と `super-robot` は別プロダクト
- super-robot は触らない (別事業 = ペーパートレード SaaS)

---

## ステップ 7. 動作確認

1. https://v-corp.inc にアクセス → LP 表示
2. 「ウェイトリスト登録」フォーム → 自分のメールで送信 → Supabase の `waitlist` テーブルに行が追加されるか
3. 「プランを選ぶ」ボタン → Stripe Checkout に遷移するか
4. テストカード `4242 4242 4242 4242` で決済 → `subscriptions` テーブルに行が追加されるか
5. Stripe Dashboard → Events で webhook が成功 (HTTP 200) になっているか
6. Discord に通知が届くか

---

## トラブルシュート

| 症状 | 原因 / 対処 |
| --- | --- |
| ビルドエラー `Module not found: '@/components/...'` | tsconfig.json の `paths` 設定確認 / Root Directory 設定漏れ |
| Stripe Webhook が 401 | `STRIPE_WEBHOOK_SECRET` が間違い / Vercel で env 反映後 redeploy が必要 |
| Supabase RLS エラー | service_role key を使うべき箇所で anon key を使っている |
| `v-corp.inc` の SSL 証明書が出ない | DNS 反映待ち (最大48時間) / Vercel Domains 画面で再検証 |
| お名前.com の DNS 変更が反映されない | キャッシュTTL 経過待ち / `dig v-corp.inc` で確認 |

---

*最終更新: 2026-05-02 / Owner: V-Corp 代表者*
