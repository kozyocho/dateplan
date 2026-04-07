@AGENTS.md

# dateplan プロジェクト

## 概要
AIがデートプランを自動生成するWebサービス。
条件の細かさで差別化。初期エリア: 名古屋・東京。
最終目標: マネタイズ後にサービス売却。

## エージェント構成とルーティング

### 呼び出しフロー
```
Shohei
  └→ CEO（ビジネス判断・戦略）
       └→ Manager（タスク管理・スプリント計画・ルーティング）
            ├→ Full Stack Dev（Next.js/Supabase/React実装）
            ├→ AI Engineer（Claude API・プロンプト）
            ├→ Stripe Engineer（課金・サブスクリプション）
            ├→ SEO Copywriter（LP文章・SEO・コンテンツ）
            ├→ Market Researcher（競合調査・市場分析）
            ├→ UI/UX Designer（画面設計・UX改善）
            └→ Marketer（グロース戦略・ユーザー獲得）
```

### エージェントファイルパス
| エージェント | パス |
|------------|------|
| CEO | `.claude/agents/management/ceo.md` |
| Manager | `.claude/agents/management/manager.md` |
| Full Stack Dev | `.claude/agents/development/full-stack-dev.md` |
| AI Engineer | `.claude/agents/development/ai-engineer.md` |
| Stripe Engineer | `.claude/agents/development/stripe-engineer.md` |
| SEO Copywriter | `.claude/agents/marketing/seo-copywriter.md` |
| Market Researcher | `.claude/agents/research/market-researcher.md` |
| UI/UX Designer | `.claude/agents/design/uiux-designer.md` |
| Marketer | `.claude/agents/marketing/marketer.md` |

## 重要ファイル
- `PLAN.md` — 全体実装計画（8フェーズ）
- `TASKS.md` — タスクボード（Manager が管理）

## 技術スタック
- **Framework**: Next.js 15 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Auth/DB**: @supabase/ssr + Supabase PostgreSQL
- **AI**: @anthropic-ai/sdk (claude-sonnet-4-6)
- **課金**: Stripe (subscription)
- **Hosting**: Vercel

## 【必須ルール】新エージェント・大機能追加時
エージェントの新規追加・既存パイプラインの大きな変更は、**必ずPlan Modeで設計・確認してから実装する**。

## 禁止事項
- `@supabase/auth-helpers-nextjs` は非推奨・使用禁止（`@supabase/ssr` を使う）
- `next/router` は使用禁止（`next/navigation` を使う）
- `.env.local` をコミットしない
- Stripe webhookで `request.json()` を先に呼ぶのは禁止（`request.text()` を先に呼ぶ）
