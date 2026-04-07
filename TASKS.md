# dateplan タスクボード

最終更新: 2026-03-29 午後

---

## 🔴 現在のフェーズ: Phase 2〜7 — Supabase/Stripe接続・実環境テスト

---

## ✅ 完了済みタスク
- [x] PLAN.md 作成（2026-03-29）
- [x] エージェント設計・作成（CEO/Manager/FullStackDev/AIEngineer/StripeEngineer/SEOCopywriter）（2026-03-29）
- [x] create-next-app + 全パッケージインストール（2026-03-29）
- [x] shadcn/ui 初期化 + コンポーネント追加（2026-03-29）
- [x] .env.local.example 作成（2026-03-29）
- [x] types/index.ts 型定義（2026-03-29）
- [x] lib/supabase/{server,client,middleware}.ts（2026-03-29）
- [x] lib/stripe.ts / lib/anthropic.ts 初期化（2026-03-29）
- [x] lib/usage.ts 利用制限ロジック（2026-03-29）
- [x] lib/prompts/date-plan.ts プロンプトテンプレート（2026-03-29）
- [x] proxy.ts（Next.js 16 対応）（2026-03-29）
- [x] app/auth/callback/route.ts（2026-03-29）
- [x] app/(auth)/login/page.tsx（2026-03-29）
- [x] app/api/generate/route.ts（SSEストリーミング）（2026-03-29）
- [x] app/api/plans/route.ts（2026-03-29）
- [x] app/api/checkout/route.ts（2026-03-29）
- [x] app/api/webhooks/stripe/route.ts（2026-03-29）
- [x] components/form/ConditionForm.tsx（4ステップ）（2026-03-29）
- [x] components/plan/StreamingText.tsx（2026-03-29）
- [x] components/plan/PlanTimeline.tsx（2026-03-29）
- [x] app/page.tsx LP（2026-03-29）
- [x] app/(app)/generate/page.tsx（2026-03-29）
- [x] app/(app)/history/page.tsx（2026-03-29）
- [x] supabase/migrations/001_initial_schema.sql（2026-03-29）
- [x] npm run build 成功確認（2026-03-29）

---

## 🔥 進行中
（なし）

---

## ✅ Phase 1: プロジェクト初期設定（完了）
- [x] create-next-appでプロジェクト作成
- [x] 依存パッケージインストール
- [x] shadcn/ui初期化 + 基本コンポーネント追加
- [x] .env.local テンプレート作成
- [x] Supabaseテーブル・RLS・Triggerのマイグレーション作成

## 📋 Phase 2: Auth
- [ ] lib/supabase/server.ts（createServerClient） | Full Stack Dev | 高 | 依存: Phase1
- [ ] lib/supabase/client.ts（createBrowserClient） | Full Stack Dev | 高 | 依存: Phase1
- [ ] lib/supabase/middleware.ts（updateSession） | Full Stack Dev | 高 | 依存: Phase1
- [ ] middleware.ts（ルートガード） | Full Stack Dev | 高 | 依存: Phase1
- [ ] app/auth/callback/route.ts（OAuth callback） | Full Stack Dev | 高 | 依存: Phase1
- [ ] ログイン・登録ページ UI | Full Stack Dev | 高 | 依存: Phase1

## 📋 Phase 3: LP
- [ ] LPコピー作成（Hero/特徴/使い方/料金/CTA） | SEO Copywriter | 高 | 依存: Phase1
- [ ] app/page.tsx LP実装 | Full Stack Dev | 高 | 依存: LPコピー
- [ ] OGP画像・メタデータ設定 | SEO Copywriter | 中 | 依存: LP実装

## 📋 Phase 4: 条件入力フォーム
- [ ] types/index.ts 型定義（PlanConditions） | Full Stack Dev | 高 | 依存: Phase2
- [ ] components/form/ConditionForm.tsx（4ステップ） | Full Stack Dev | 高 | 依存: 型定義
- [ ] フォームバリデーション（zod schema） | Full Stack Dev | 高 | 依存: フォーム
- [ ] app/(app)/generate/page.tsx | Full Stack Dev | 高 | 依存: フォーム

## 📋 Phase 5: AI生成
- [ ] lib/anthropic.ts 初期化 | AI Engineer | 高 | 依存: Phase4
- [ ] lib/prompts/date-plan.ts プロンプトテンプレート | AI Engineer | 高 | 依存: Phase4
- [ ] app/api/generate/route.ts（SSEストリーミング） | AI Engineer | 高 | 依存: プロンプト
- [ ] 利用回数チェック・インクリメント（lib/usage.ts） | Full Stack Dev | 高 | 依存: APIルート

## 📋 Phase 6: 結果表示
- [ ] components/plan/StreamingText.tsx | Full Stack Dev | 高 | 依存: Phase5
- [ ] components/plan/PlanTimeline.tsx | Full Stack Dev | 高 | 依存: Phase5
- [ ] app/(app)/result/[id]/page.tsx | Full Stack Dev | 高 | 依存: PlanTimeline
- [ ] app/(app)/history/page.tsx（プラン一覧） | Full Stack Dev | 中 | 依存: 結果表示

## 📋 Phase 7: Stripe課金
- [ ] lib/stripe.ts 初期化 | Stripe Engineer | 高 | 依存: Phase6
- [ ] lib/usage.ts 利用制限ロジック | Stripe Engineer | 高 | 依存: Phase6
- [ ] app/api/checkout/route.ts | Stripe Engineer | 高 | 依存: lib/stripe
- [ ] app/api/webhooks/stripe/route.ts | Stripe Engineer | 高 | 依存: checkout
- [ ] アップグレードUI（無料制限時のモーダル） | Full Stack Dev | 中 | 依存: webhook

## 📋 Phase 8: SEO最適化
- [ ] app/plans/[area]/page.tsx（静的ページ） | Full Stack Dev | 中 | 依存: Phase7
- [ ] SEO記事コンテンツ（名古屋/東京） | SEO Copywriter | 中 | 依存: 静的ページ
- [ ] app/sitemap.ts 自動生成 | Full Stack Dev | 低 | 依存: 静的ページ
- [ ] app/robots.ts | Full Stack Dev | 低 | 依存: Phase7

---

## 🗓 バックログ（MVP完成後）
- [ ] 英語対応（i18n） | Full Stack Dev | 中
- [ ] 大阪エリア追加 | Full Stack Dev | 中
- [ ] React Native（iOS/Android） | Full Stack Dev | 低
- [ ] プランのSNSシェア機能 | Full Stack Dev | 低
- [ ] A/Bテスト（プロンプト最適化） | AI Engineer | 低
- [ ] KPIダッシュボード | Full Stack Dev | 低
- [ ] M&A出品準備（ラッコM&A） | CEO | 将来

---

## ブロッカー・課題
（なし）
