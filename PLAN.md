# dateplan MVP 実装計画

## プロジェクト概要
AIがデートプランを自動生成するWebサービス。
条件の細かさで差別化。初期エリア: 名古屋・東京。
目標: マネタイズ後にサービス売却。

## 技術スタック（確認済み）
- **Frontend/Backend**: Next.js 15 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **AI**: @anthropic-ai/sdk (claude-sonnet-4-6) — ストリーミング対応
- **Auth/DB**: @supabase/ssr (auth-helpersは非推奨) + Supabase PostgreSQL
- **課金**: stripe (server) + @stripe/stripe-js (client)
- **Hosting**: Vercel

## ディレクトリ構造
```
/root/projects/dateplan/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (app)/
│   │   ├── generate/page.tsx       # メイン：条件入力フォーム
│   │   ├── result/[id]/page.tsx    # 生成結果表示
│   │   ├── history/page.tsx        # プラン履歴
│   │   └── settings/page.tsx       # アカウント設定
│   ├── api/
│   │   ├── generate/route.ts       # Claude API呼び出し（streaming）
│   │   ├── plans/route.ts          # プラン保存・取得
│   │   ├── checkout/route.ts       # Stripe checkout session作成
│   │   └── webhooks/stripe/route.ts # Stripe webhook
│   ├── auth/callback/route.ts      # Supabase OAuth callback
│   ├── layout.tsx
│   ├── page.tsx                    # LP
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn/ui コンポーネント
│   ├── form/
│   │   ├── ConditionForm.tsx       # 条件入力フォーム（メイン）
│   │   ├── AreaSelect.tsx          # エリア選択（名古屋/東京）
│   │   └── BudgetSlider.tsx
│   ├── plan/
│   │   ├── PlanTimeline.tsx        # 結果タイムライン表示
│   │   ├── PlanCard.tsx
│   │   └── StreamingText.tsx       # ストリーミング表示
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── server.ts               # createServerClient
│   │   ├── client.ts               # createBrowserClient
│   │   └── middleware.ts           # updateSession
│   ├── stripe.ts                   # Stripe初期化
│   ├── anthropic.ts                # Anthropic初期化
│   └── prompts/
│       └── date-plan.ts            # プロンプトテンプレート
├── types/
│   └── index.ts                    # 型定義
├── middleware.ts                   # Auth middleware
├── next.config.ts
└── .env.local
```

---

## Phase 1: プロジェクト初期設定
**目標**: 動くNext.jsプロジェクトを作り、全依存関係を設定する

### タスク
1. `create-next-app`でプロジェクト作成
2. 依存パッケージインストール
3. shadcn/ui初期化
4. 環境変数ファイル作成
5. Supabaseプロジェクト作成 + テーブル設計
6. `lib/` 初期化ファイル作成

### インストールするパッケージ
```bash
# Core
npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# Supabase
npm install @supabase/ssr @supabase/supabase-js

# Stripe
npm install stripe @stripe/stripe-js

# Anthropic
npm install @anthropic-ai/sdk

# UI
npx shadcn@latest init
npx shadcn@latest add button card input select slider badge

# Form
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install clsx tailwind-merge lucide-react
```

### 環境変数（.env.local）
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Supabaseテーブル設計
```sql
-- ユーザープロファイル
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan_count integer default 0,    -- 今月の生成回数
  plan_reset_at timestamptz default now(), -- 毎月リセット
  is_pro boolean default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

-- 生成済みデートプラン
create table date_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  title text not null,
  conditions jsonb not null,   -- 入力条件をそのまま保存
  plan_content text not null,  -- AI生成テキスト
  area text not null,          -- nagoya / tokyo
  created_at timestamptz default now()
);

-- RLS設定
alter table profiles enable row level security;
alter table date_plans enable row level security;

create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can read own plans" on date_plans for select using (auth.uid() = user_id);
create policy "Users can insert own plans" on date_plans for insert with check (auth.uid() = user_id);
create policy "Users can delete own plans" on date_plans for delete using (auth.uid() = user_id);

-- 新規ユーザー登録時にprofileを自動作成
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 検証
- [ ] `npm run dev`でlocalhost:3000が開く
- [ ] Supabaseのテーブルが作成されている
- [ ] `lib/supabase/server.ts`でcreateServerClientが動く

---

## Phase 2: Auth実装
**目標**: メールとGoogle OAuthでログイン/登録できる

### 使用パターン（ドキュメント確認済み）
```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'  // ← auth-helpersではない
import { cookies } from 'next/headers'

// middleware.ts
// → updateSession関数でトークン自動更新
```

### タスク
1. `lib/supabase/server.ts` 作成（createServerClient）
2. `lib/supabase/client.ts` 作成（createBrowserClient）
3. `lib/supabase/middleware.ts` 作成（updateSession）
4. `middleware.ts` 設定（静的ファイル除外）
5. `app/auth/callback/route.ts` 作成（OAuth callback）
6. ログイン/登録ページ作成
7. Supabase ダッシュボードでGoogle OAuthを有効化

### 検証
- [ ] メールでサインアップ→確認メール→ログイン完了
- [ ] Googleボタンでサインイン→リダイレクト→ログイン完了
- [ ] 未ログイン状態で /generate にアクセス→ /login にリダイレクト

---

## Phase 3: LP（ランディングページ）
**目標**: SEOを意識したLPを作る（「名古屋 デートプラン」等でヒット）

### SEO設計
```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: 'AIデートプラン生成 | 名古屋・東京のデートをAIが提案',
  description: '人数、予算、天候、移動手段まで細かく設定できるAIデートプランジェネレーター。名古屋・東京のおすすめデートコースを瞬時に生成。',
  keywords: ['デートプラン', '名古屋 デート', '東京 デート', 'AIデート提案', 'カップル'],
}
```

### LPセクション構成
1. **Hero** — キャッチコピー + 「プランを作る」CTAボタン
2. **特徴** — 条件の細かさを3点でアピール
3. **使い方** — 3ステップ（設定→生成→楽しむ）
4. **プラン例** — サンプルプランの静的表示（SEO兼用）
5. **料金** — 無料/Pro比較表
6. **CTA** — 再度「今すぐ試す」ボタン

### 検証
- [ ] Lighthouse SEOスコア 90+
- [ ] モバイル表示確認
- [ ] CTAボタンが /generate or /login に遷移

---

## Phase 4: 条件入力フォーム
**目標**: 差別化となる詳細条件入力フォームを実装

### 入力フィールド定義
```typescript
// types/index.ts
export type PlanConditions = {
  area: 'nagoya' | 'tokyo'
  location: string          // 駅名・地名（自由入力）
  people_count: 1 | 2 | 3 | 4 | '5+'
  age_group: 'teens' | 'twenties' | 'thirties' | 'forties_plus'
  gender_combo: 'male_female' | 'male_male' | 'female_female' | 'mixed'
  relationship: 'first_date' | 'new_couple' | 'couple' | 'married' | 'friends' | 'family'
  scene: 'anniversary' | 'casual' | 'surprise' | 'first_date' | 'holiday'
  time_start: string        // "10:00", "14:00" etc
  duration_hours: 3 | 4 | 5 | 6 | 8 | 10
  transport: ('train' | 'taxi' | 'car' | 'walk')[]
  weather: 'sunny' | 'cloudy' | 'rainy' | 'any'
  budget_per_person: 1000 | 3000 | 5000 | 10000 | 20000 | 30000
  genre_preferences: string[]  // グルメ/自然/アート/アクティビティ等
  genre_ng: string[]
}
```

### フォームUX
- Step 1: エリア・場所・人数
- Step 2: 年齢・性別・関係性・シーン
- Step 3: 時間・移動手段・天候・予算
- Step 4: 好みジャンル（任意）
- 確認画面 → 「プランを生成」ボタン

### 検証
- [ ] 全フィールド入力してsubmit→APIにPOST
- [ ] バリデーションエラーが表示される
- [ ] モバイルで操作しやすい

---

## Phase 5: AI生成API（Claude連携）
**目標**: 条件を受け取りClaudeがデートプランをストリーミング生成

### APIエンドポイント
```typescript
// app/api/generate/route.ts
import Anthropic from '@anthropic-ai/sdk'  // v0.80.0+

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  // 1. Auth確認
  // 2. 利用回数チェック（無料ユーザー: 3回/月）
  // 3. 条件をプロンプトに変換
  // 4. client.messages.stream() でストリーミング
  // 5. SSE (Server-Sent Events) でフロントに返す
  // 6. 完了後にDBに保存
}
```

### プロンプト設計
```typescript
// lib/prompts/date-plan.ts
export function buildDatePlanPrompt(conditions: PlanConditions): string {
  return `
あなたはデートプランの専門家です。以下の条件に合わせた詳細なデートプランを作成してください。

【条件】
エリア: ${conditions.area === 'nagoya' ? '名古屋' : '東京'}
出発地点: ${conditions.location}
人数: ${conditions.people_count}人
関係性: ${formatRelationship(conditions.relationship)}
シーン: ${formatScene(conditions.scene)}
開始時間: ${conditions.time_start}
所要時間: ${conditions.duration_hours}時間
移動手段: ${conditions.transport.map(formatTransport).join('・')}
天候: ${formatWeather(conditions.weather)}
予算（一人）: ${conditions.budget_per_person.toLocaleString()}円

【出力形式】
以下のJSON形式で出力してください：
{
  "title": "プランのタイトル（例: 名古屋レトロ散歩デート）",
  "summary": "このプランの概要（2〜3文）",
  "timeline": [
    {
      "time": "10:00",
      "duration": "90分",
      "place": "スポット名",
      "category": "食事/観光/ショッピング/etc",
      "description": "場所の説明・おすすめポイント（2〜3文）",
      "transport_to_next": "次の場所への移動手段と所要時間",
      "estimated_cost": 1500
    }
  ],
  "total_estimated_cost": 8500,
  "tips": ["デートをより良くするアドバイス（2〜3個）"]
}
`
}
```

### 検証
- [ ] POSTリクエストを送るとSSEでストリーミングが返ってくる
- [ ] 無料ユーザーが4回目を試みると403エラー
- [ ] プランが正常にDB保存される

---

## Phase 6: 結果表示・プラン保存
**目標**: 生成されたプランをタイムライン形式で表示・保存

### コンポーネント
```tsx
// components/plan/PlanTimeline.tsx
// - タイムライン形式（時刻→場所→説明→移動）
// - 各スポットにカテゴリアイコン
// - 合計費用の表示
// - 「保存」「シェア」「もう一度生成」ボタン

// components/plan/StreamingText.tsx
// - SSEを受け取りリアルタイムに表示
// - 生成中はアニメーション表示
```

### プラン履歴ページ（/history）
- ログインユーザーのみアクセス可
- 保存済みプランの一覧（カード表示）
- 削除機能

### 検証
- [ ] ストリーミング中にテキストが徐々に表示される
- [ ] 完了後に「保存」ボタンで保存される
- [ ] /history に保存済みプランが表示される

---

## Phase 7: Stripeサブスクリプション
**目標**: 月480円のProプランで課金できる

### 制限ロジック
```typescript
// 無料ユーザー: 月3回まで
// Proユーザー: 無制限
// 毎月1日に回数リセット（Stripe webhookで管理 or cron）
```

### Stripeセットアップ
1. Stripeダッシュボードで商品作成（月額480円）
2. `app/api/checkout/route.ts` — checkout session作成
3. `app/api/webhooks/stripe/route.ts` — webhook処理
   - `checkout.session.completed` → is_pro = true
   - `customer.subscription.deleted` → is_pro = false

### 検証
- [ ] 「Proにアップグレード」クリック→Stripe Checkout画面に遷移
- [ ] テストカードで支払い→webhook受信→is_pro = true
- [ ] Proユーザーは制限なし生成できる

---

## Phase 8: SEO最適化
**目標**: 「名古屋 デートプラン」等のロングテールで自然流入を獲得

### 静的SEOページ
```
/plans/nagoya           # 名古屋デートプランまとめ
/plans/tokyo            # 東京デートプランまとめ
/plans/nagoya/sakae     # 栄エリア特集
/plans/nagoya/sakuradori # 桜通エリア特集
```

### 実装
```typescript
// app/plans/[area]/page.tsx
export async function generateStaticParams() {
  return [{ area: 'nagoya' }, { area: 'tokyo' }]
}

export async function generateMetadata({ params }) {
  const area = params.area === 'nagoya' ? '名古屋' : '東京'
  return {
    title: `${area}のデートプラン特集 | AIデートプラン`,
    description: `${area}のおすすめデートスポット・コースをAIが提案。...`,
  }
}
```

### 検証
- [ ] /plans/nagoya が静的ページとして生成される
- [ ] OGP画像が設定されている
- [ ] sitemap.xmlが生成される

---

## 実装順序サマリー

```
Phase 1 (1-2日): プロジェクト初期設定 + DB設計
Phase 2 (1日):   Auth実装
Phase 3 (1日):   LP作成
Phase 4 (1日):   条件入力フォーム
Phase 5 (1日):   Claude AI生成API
Phase 6 (1日):   結果表示・保存
Phase 7 (1日):   Stripe課金
Phase 8 (1日):   SEO最適化
```

**合計: 約8〜10日でMVP完成**

---

## 売却に向けたメトリクス設計
```
計測すべきKPI:
- MAU (月間アクティブユーザー)
- 生成回数/日
- 無料→Pro転換率
- MRR (月次経常収益)
- Churn rate (解約率)
- LTV (顧客生涯価値)
```

これらを整備してからM&Aプラットフォーム（ラッコM&A等）に出品。
MRR月100万円で1,200〜3,600万円での売却を目標。
