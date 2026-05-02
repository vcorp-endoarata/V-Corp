# V-Corp 組織図 (Organization Chart)

## 1. 組織ツリー

```
                          ┌──────────────────┐
                          │   Board of       │
                          │   Directors      │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │       CEO        │
                          │ (Chief Executive)│
                          └────────┬─────────┘
                                   │
        ┌──────────┬──────────┬────┼────┬──────────┬──────────┐
        │          │          │    │    │          │          │
      ┌─▼─┐     ┌─▼─┐      ┌─▼─┐ ┌▼─┐ ┌▼─┐     ┌─▼─┐      ┌─▼─┐
      │CTO│     │CPO│      │COO│ │CFO│ │CMO│     │CHRO│     │CSO│
      └─┬─┘     └─┬─┘      └─┬─┘ └┬─┘ └┬─┘     └─┬──┘      └─┬─┘
        │         │          │    │    │          │           │
        │         │          │    │    │          │           │
   ┌────┴──┐  ┌──┴──┐    ┌──┴──┐ │ ┌─┴──┐   ┌───┴───┐   ┌───┴───┐
   │ Eng   │  │Prod │    │Ops  │ │ │Mktg│   │People │   │Sec/IT │
   │ R&D   │  │Desg │    │CS   │ │ │    │   │Legal  │   │Data   │
   │ Data  │  │     │    │     │ │ │    │   │       │   │       │
   └───────┘  └─────┘    └─────┘ │ └────┘   └───────┘   └───────┘
                                 │
                            ┌────┴────┐
                            │ Finance │
                            └─────────┘
```

## 2. C-Suite (経営役員)

| 役職 | 名称                           | 主な責任                                |
| ---- | ------------------------------ | --------------------------------------- |
| CEO  | Chief Executive Officer        | 全社最終意思決定・株主対応・ビジョン     |
| CTO  | Chief Technology Officer       | 技術戦略・エンジニアリング統括           |
| CPO  | Chief Product Officer          | 製品戦略・ロードマップ                   |
| COO  | Chief Operating Officer        | 事業運営・実行統括                       |
| CFO  | Chief Financial Officer        | 財務・経理・IR                           |
| CMO  | Chief Marketing Officer        | マーケティング・ブランド                 |
| CHRO | Chief Human Resources Officer  | 人事・組織開発                           |
| CSO  | Chief Security Officer         | 情報セキュリティ・リスク管理             |

## 3. 部門マッピング

| 番号 | フォルダ              | 統括役員 | レポート先 |
| ---- | --------------------- | -------- | ---------- |
| 00   | Executive             | Board    | Board      |
| 01   | Engineering           | CTO      | CEO        |
| 02   | Product               | CPO      | CEO        |
| 03   | Design                | CPO      | CEO        |
| 04   | Sales                 | COO      | CEO        |
| 05   | Marketing             | CMO      | CEO        |
| 06   | CustomerSuccess       | COO      | CEO        |
| 07   | Finance               | CFO      | CEO        |
| 08   | People                | CHRO     | CEO        |
| 09   | Legal                 | CHRO     | CEO        |
| 10   | Operations            | COO      | CEO        |
| 11   | RnD                   | CTO      | CEO        |
| 12   | IT_Security           | CSO      | CEO        |
| 13   | Data                  | CTO      | CEO        |

## 4. 意思決定フロー

```
[アイデア] → [部門長レビュー] → [Cross-functional Sync] 
   → [C-Suite判断] → [CEO承認 (規模に応じて)] → [実行]
```

- ¥10M 未満: 部門長承認
- ¥10M〜¥100M: 担当C-Suite承認
- ¥100M〜¥1B: CEO承認
- ¥1B 超: 取締役会決議

## 5. 委員会 (Committees)

- **Strategy Committee** — 全社戦略
- **Product Committee** — 製品ロードマップ
- **Risk & Ethics Committee** — リスク・倫理
- **DEI Council** — Diversity, Equity & Inclusion
- **Innovation Council** — 新規事業創出
