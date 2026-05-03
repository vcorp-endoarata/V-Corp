# V-Corp Security Posture

> 加盟店審査 / 顧客 DD / 監査対応のための公式回答集 (v0.1)
> 構成: V-Corp Pulse (Next.js on Vercel + Supabase Pro + Stripe livemode + Anthropic API)

---

## 1. 管理者画面のアクセス制限と ID/PW 管理 — はい

| 管理対象 | アクセス制御 |
| --- | --- |
| Stripe Dashboard | 2段階認証必須 / 招待制 |
| Supabase Studio | 2FA + Pro の Network Restrictions (IP 許可リスト) |
| Vercel | 2FA + GitHub SSO |
| GitHub | 2FA (Hardware Key) + Branch Protection |

サービス独自の `/admin` ルートは現時点未実装。実装時は Vercel Edge Middleware で IP 許可リスト + 監査ログ。

## 2. データディレクトリ露出対策 — はい

| データ | 保管場所 | 公開状態 |
| --- | --- | --- |
| 顧客・サブスク | Supabase Postgres (RLS) | 非公開 |
| 決済 (カード番号等) | Stripe (V-Corp に保存しない) | 非公開 |
| シークレット | Vercel Environment Variables | 非公開 (リポジトリ非含) |
| 公開ディレクトリ `/public` | 静的アセットのみ | 公開 (機密ファイル不在) |

## 3. Web アプリケーション脆弱性対策 — はい

- 脆弱性診断 / ペンテスト: ローンチ前 + 年1回継続 (外部ベンダー)
- SQLi: Supabase JS クライアント (パラメタライズドクエリ) で防御
- XSS: React 自動エスケープ + CSP
- CSRF: Next.js + SameSite Cookie + Stripe Webhook 署名検証
- 入力検証: Zod スキーマで全 API 入力検証 (`/api/*`)
- 依存パッケージ: GitHub Dependabot + Renovate で自動更新、CI で `npm audit`
- レビュー: 全変更を PR レビュー + Branch Protection

## 4. マルウェア対策 — はい

- 開発端末: macOS XProtect / Windows Defender + 定期フルスキャン
- 本番インフラ: Vercel / Supabase マネージド (SOC 2 Type II)
- アプリ層: ユーザーアップロード機能未実装。将来追加時は Supabase Storage + ClamAV

## 5. 悪質な有効性確認・クレジットマスター対策 — はい

- EMV 3-D セキュア: Stripe で自動有効化、高額取引で強制
- 有効性確認回数制限: Stripe Radar が自動 (IP/カード/顧客単位)
- エラーメッセージの汎化: Stripe Checkout 側で詳細を返さない
- 不審 IP 制限: Stripe Radar の機械学習で自動ブロック

## 6. 不正ログイン対策 — はい (複数該当)

V-Corp Pulse は **会員制 SaaS** につき「該当なし」は選ばない。
有効な対策:

- 本人確認のための二段階認証 / 多要素認証 — Supabase Auth (Magic Link + TOTP/Passkey)
- ログイン試行回数の制限とスロットリング — Supabase Auth デフォルト (10分/30回)
- ログイン時またはアカウント変更時のメール通知 — Supabase Auth + Postmark
- 不審 IP からのアクセス制限 — Vercel Middleware (将来 Cloudflare 拡張)
- ユーザー登録時の個人情報確認 — Email 検証必須

## 委託先情報 — 従業員 (主)

- 運用・インシデント対応・ログ監視: **従業員 (代表者)**
- インフラ提供: Vercel Inc. / Supabase Inc. (SOC 2 Type II 認証)
- 決済 PCI-DSS: Stripe, Inc. (PCI-DSS Level 1 認証)
- 脆弱性診断 (年次): 外部セキュリティベンダー (予定)

---

## 決済方式

- **メイン**: Stripe Checkout (`mode: subscription` / `mode: payment`)
- **単発**: Stripe Payment Links (Business Name 設定後発行)
- **大企業**: Stripe Invoicing (Business / Enterprise プラン)
- **解約**: Stripe Customer Portal (顧客セルフサービス)
- **イベント**: Stripe Webhooks (`/api/webhooks/stripe`、署名検証必須)

カード情報は **V-Corp サーバーを通過・保存しない** (Stripe Tokenization)。
PCI-DSS スコープは Stripe が負担。

## ネットワーク・暗号化

- 通信: TLS 1.3 (Vercel 自動)
- 保管時暗号化: AES-256 (Supabase 自動)
- Webhook: HMAC SHA-256 署名検証
- シークレット管理: Vercel Env / Supabase Secrets / GitHub Secrets

## 監査ログ

- アプリ層: Supabase `audit_logs` テーブルに記録
- インフラ層: Vercel Logs (90日保持) / Supabase Logs
- 決済: Stripe Dashboard (永続保持)

## 認証 / 認可

- 認証: Supabase Auth (Magic Link メイン + TOTP/Passkey 二要素)
- 認可: Postgres Row Level Security (テナント単位の完全分離)
- セッション: HttpOnly + Secure + SameSite=Lax Cookie

## インシデント対応

1. 検知: Discord 通知 (Stripe webhook / Supabase logs / Vercel alerts)
2. 初動 1時間以内: 影響範囲特定 + 暫定遮断
3. 24時間以内: 根本原因 + 永続対策決定
4. 必要に応じ: 個人情報保護委員会 / 関係者通知

---

*最終更新: 2026-05-02 / Owner: V-Corp 代表者*
