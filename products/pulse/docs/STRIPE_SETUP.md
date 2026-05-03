# Stripe ビジネス詳細 入力ガイド

> Stripe ダッシュボードで「ビジネスの詳細を入力してください」と求められた際、
> このガイドの値をそのままコピペすれば V-Corp として正しく設定できます。
>
> **注意**: 本人確認 (KYC) を通過するため、**個人情報は必ず実在するあなた自身のもの** を入力してください。
> 「V-Corp」はあくまで顧客に見える *ブランド名 (Public business name)* として使います。

---

## 入力フォーム別ガイド

### 1. ビジネス形態 (Business type)

| あなたの状況 | 選択肢 |
| --- | --- |
| まだ法人化していない | **Individual** (個人) |
| 法人登記済み | **Company** → さらに `Sole proprietorship` / `Single-member LLC` / `Private corporation` 等から実態にあわせて選択 |

**迷ったら Individual** で問題ありません。後から法人へ切替可能です。

---

### 2. ビジネス情報 (Business details)

| フィールド | 推奨入力値 |
| --- | --- |
| Legal business name / 氏名 | (あなたの実名 or 登記名) |
| **Public business name** | `V-Corp` |
| **Statement descriptor** (請求明細表示) | `VCORP` (半角英数のみ、最大22文字) |
| **Shortened descriptor** | `VCORP` |
| **Business website** | 暫定 `https://github.com/MrRG32/V-Corp` (LP公開後に差し替え) |
| **Industry** | `Software` (上位カテゴリ) |
| **MCC (Merchant Category Code)** | `5734 — Computer Software Stores` または `7372 — Prepackaged Software` |
| **Product description** | 下記コピペ参照 |
| **Phone number** | (実電話番号) |
| **Business address** | (実住所) |

#### Product description (英語コピペ用)

```
V-Corp Pulse is an AI-powered business intelligence and decision-support SaaS
for small and medium-sized enterprises in Japan. We provide daily AI-generated
executive briefings, on-demand strategy reports, and a KPI dashboard with AI
anomaly detection. Customers pay a recurring monthly or annual subscription
(JPY 2,980 to JPY 198,000 per month, billed via Stripe Checkout / Subscriptions).
```

#### Product description (日本語版が必要な場合)

```
V-Corp Pulse は、日本の中小企業向け AI 経営判断 SaaS です。毎朝の AI 経営ブリーフィング、
オンデマンド戦略レポート生成、AI 異常検知付き KPI ダッシュボードを提供します。
月額・年額のサブスクリプション課金 (¥2,980 〜 ¥198,000/月) を Stripe Checkout / Subscriptions 
経由で受け付けます。
```

---

### 3. Tax / 税務情報

| 区分 | 入力 |
| --- | --- |
| 個人事業主 | マイナンバー (12桁) |
| 法人 | 法人番号 (13桁) |
| インボイス登録番号 (任意) | `T` + 13桁 (取得済みの場合のみ) |

---

### 4. 本人確認書類 (Identity verification)

オンラインアップロードを求められます。以下のいずれか1点:

- 運転免許証 (表裏)
- マイナンバーカード (表面のみ)
- パスポート (顔写真ページ)

**画像撮影のコツ**: 明るい場所、四隅すべて写す、反射NG。

---

### 5. 入金口座 (Payouts)

事業の売上を受け取る銀行口座情報:

- 銀行名 (例: みずほ銀行)
- 支店名 (例: 渋谷支店)
- 口座種別 (普通 / 当座)
- 口座番号
- 口座名義 (カナ)

**個人の場合**: あなた個人の口座でOK。  
**法人の場合**: 法人名義の口座が必要 (個人口座は不可)。

---

### 6. Public details (これが Payment Link 解禁の鍵 🔑)

| フィールド | 入力 |
| --- | --- |
| **Public business name** | `V-Corp` ← この設定がないと Payment Link が作れない |
| Support email | 実在のサポート用メール (例: `support@v-corp.io`、未取得なら個人 Gmail でOK) |
| Support phone | 実電話番号 (なければ空欄可) |
| Support address | 実住所 |

**設定場所**: Dashboard → Settings → **Public details**

---

## 入力後にやること

設定完了後、Discord に通知してください。私の側で以下を即実行します:

1. 9価格全てに **Payment Link 発行** (¥2,980/月 〜 ¥498,000/案件)
2. Payment Link の URL を `products/pulse/README.md` に集約
3. LP の "今すぐ申し込む" ボタンに紐付け

---

## よくある詰まり

| 症状 | 解決 |
| --- | --- |
| "Statement descriptor must be 5–22 chars, A-Z 0-9" | `VCORP` を推奨 (5文字 半角英数のみ) |
| "Website is required" | LP 未公開なら `https://github.com/MrRG32/V-Corp` でも通る |
| 本人確認が "Pending review" のまま | 1-2営業日以内に Stripe から結果メール |
| KYC で reject | 鮮明な撮影し直し、別書類で再提出 |
