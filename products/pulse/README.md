# V-Corp Pulse

> 経営判断を、データと AI で 10倍速く、10倍正確に。

V-Corp の旗艦プロダクト第1弾。
中小企業・スタートアップ経営者向けの **AI経営判断プラットフォーム**。

---

## ワンライナー

「毎朝3分、AI が世界の動きと自社の数字を読み解いて、
今日の経営判断に必要な3つのアクションを提示する。」

## ターゲット

- 個人事業主・1人会社（Starter）
- 〜従業員30名のスタートアップ（Pro）
- 〜従業員300名の中堅企業（Business）
- 大手・上場企業（Enterprise）

## 主要機能

| # | 機能 | 説明 |
| - | --- | --- |
| 1 | AI Daily Briefing | 毎朝7:00、市場/競合/自社KPI を3行サマリー |
| 2 | On-demand Strategy Reports | チャットで「競合A社の最新動向」など指示すると AI が15分で20Pレポート |
| 3 | KPI Dashboard | 売上/原価/CVR等のリアルタイム可視化 + AI による異常検知 |
| 4 | Board Pack Generator | 取締役会用エグゼクティブサマリーを自動生成 |
| 5 | Slack/Teams 連携 | 質問→AI回答 が業務チャットに直結 |

## 価格 (JPY, 税抜)

| プラン | 月額 | 年額 (17% OFF) | 用途 |
| --- | --- | --- | --- |
| Starter | ¥2,980 | ¥29,800 | 個人事業主 |
| Pro | ¥12,800 | ¥128,000 | スタートアップ (5ユーザー) |
| Business | ¥49,800 | ¥498,000 | 中堅企業 (25ユーザー, SSO/API) |
| Enterprise | ¥198,000〜 | カスタム | 大手 (専用モデル, オンプレ可) |

特典:
- **Founder Lifetime Pro**: ¥298,000 (先着100名・Pro 機能を生涯)
- **Strategy Sprint** (1案件型コンサル): ¥498,000

## Stripe IDs (livemode)

| プラン | Product ID | Price ID | 金額 |
| --- | --- | --- | --- |
| Starter (月) | `prod_URY15wNdwoMJ2Z` | `price_1TSewDCwVQEZ2XFqL2aVTHYf` | ¥2,980/mo |
| Starter (年) | `prod_URY15wNdwoMJ2Z` | `price_1TSewGCwVQEZ2XFqfbFYd3f8` | ¥29,800/yr |
| Pro (月)     | `prod_URY1pulsdr0jTA` | `price_1TSewICwVQEZ2XFqQPBBU1pw` | ¥12,800/mo |
| Pro (年)     | `prod_URY1pulsdr0jTA` | `price_1TSewLCwVQEZ2XFqUrHo8QkQ` | ¥128,000/yr |
| Business (月) | `prod_URY1GSfQE5eHYo` | `price_1TSewQCwVQEZ2XFqQUC8tlWT` | ¥49,800/mo |
| Business (年) | `prod_URY1GSfQE5eHYo` | `price_1TSewTCwVQEZ2XFqt0zkp12F` | ¥498,000/yr |
| Enterprise (月) | `prod_URY1C2ke2d03xR` | `price_1TSewVCwVQEZ2XFqCEAIRfGJ` | ¥198,000/mo |
| Founder Lifetime | `prod_URY1tbZwVEpnbE` | `price_1TSewYCwVQEZ2XFqv4afuJc5` | ¥298,000 |
| Strategy Sprint | `prod_URY13pafsxX941` | `price_1TSewaCwVQEZ2XFqHqdc2ZqR` | ¥498,000 |

## ディレクトリ構成

```
products/pulse/
├── README.md           本ファイル
├── docs/               プロダクト仕様・GTM・PRD
├── db/                 Supabase スキーマSQL
├── scripts/            運用スクリプト
└── marketing/          LP コピー・ローンチ計画
```
