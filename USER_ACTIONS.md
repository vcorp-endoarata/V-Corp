# V-Corp — User Actions Required

> 私 (Claude) がコネクタ経由で代行できないため、**あなた** に一度だけ実施いただきたい設定リスト。
> 完了したら `[x]` でチェックしてください。

## 🔴 即時必須 (収益化に直結)

- [ ] **Stripe ダッシュボードで「事業者名 (Business Name)」を設定**  
  → これがないと Payment Link / Checkout が使えません。  
  Dashboard → Settings → Public details → Public business name に「V-Corp」など入力。
- [ ] **Stripe Webhook エンドポイントを設定** (将来のアプリ用)  
  Dashboard → Developers → Webhooks → Add endpoint  
  `customer.subscription.*`, `invoice.*`, `checkout.session.completed` を購読。

## 🟡 高優先 (情報共有・自動化に必要)

- [ ] **Discord Webhook URL を取得して `.env` に設定**  
  Discord Channel ⚙ → Integrations → Webhooks → New Webhook → URL コピー  
  ```
  cp .env.example .env
  echo 'DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/.../...' >> .env
  ```
  動作確認:
  ```
  ./scripts/notify.sh "V-Corp 通知テスト :tada:"
  ./scripts/daily-summary.sh --dry-run
  ```
- [ ] **Supabase MCP を再認証** (Pro プラン契約済みの V-Corp 組織を反映)  
  Claude Code: `/mcp` → Supabase → Re-authorize → V-Corp 組織を選択  
  完了後、Claude が `list_organizations` で V-Corp を検出できる状態になります。
- [ ] **Anthropic API Key を発行 → `.env` に設定**  
  https://console.anthropic.com/settings/keys

## 🟢 中優先 (ローンチ前)

- [ ] **ドメイン取得**: `v-corp.io` または `vcorp.jp` 等  
  Vercel の `check_domain_availability_and_price` ツールでも調査可能。
- [ ] **Vercel プロジェクト作成** (`super-robot` を流用 or 新規)  
  プロジェクト作成後、`SUPABASE_*`, `STRIPE_*`, `ANTHROPIC_API_KEY` を Env Vars に設定。
- [ ] **Postmark / Resend アカウント開設** (顧客向けトランザクションメール)
- [ ] **GitHub Actions Secret 設定** (PR/CI 連携時)  
  `STRIPE_API_KEY`, `DISCORD_WEBHOOK_URL`, `SUPABASE_*`

## 🔵 低優先 (スケール時)

- [ ] **法人設立** (もしまだなら): V-Corp 株式会社 として登記
- [ ] **インボイス登録番号取得**
- [ ] **ISMS / ISO27001 / ISMAP 準備** (Enterprise 顧客向け)
- [ ] **特商法表記ページ** (LP に必須)
- [ ] **プライバシーポリシー / 利用規約** (法務テンプレ → カスタム)

---

## 私 (Claude) が今すぐ進められること

上記が揃わなくても、以下は引き続き実施できます:

- Stripe 製品 / 価格の追加・調整
- Supabase スキーマSQLの拡張
- ドキュメント (PRD / マーケコピー / 技術設計) の充実
- LP のソースコード生成 (Next.js)
- GTM コンテンツの執筆
- 運用スクリプトの追加

**「次これやって」と指示するだけで、即実行します。**
