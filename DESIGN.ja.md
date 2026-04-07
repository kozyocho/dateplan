# DESIGN.md — dateplan

> このファイルはAIエージェントが正確な日本語UIを生成するためのデザイン仕様書です。
> セクションヘッダーは英語、値の説明は日本語で記述しています。

---

## 1. Visual Theme & Atmosphere

<!-- サービスの視覚的な印象、デザイン哲学を記述する -->

- **デザイン方針**: クリーン・温かみのある・写真優先。純白のキャンバスにブランドアクセント1色のみを使い、コンテンツ（写真・プランカード）を主役にする
- **密度**: ゆったりとしたメディア型。雑誌をめくるようにスクロールし、各カードが没入感を持って表示される
- **キーワード**: 温かみ、開放的、招待的、写真中心、直感的

---

## 2. Color Palette & Roles

<!-- 色はすべて hex 値で記述。実サイトの computed style に基づくこと -->

### Primary（ブランドカラー）

- **Primary** (`#ff385c`): メインのブランドカラー（Rausch Red）。CTAボタン、リンク、アクティブ状態に使用
- **Primary Dark** (`#e00b41`): ホバー・プレス時のプライマリカラー（Deep Rausch）

### Semantic（意味的な色）

- **Danger** (`#c13515`): エラー、削除、危険な操作（Error Red）
- **Danger Dark** (`#b32505`): Dangerのホバー・プレス状態
- **Warning** (`#ffb400`): 警告、注意喚起（システム定義外・本デザインシステム補完値）
- **Success** (`#008a05`): 成功、完了（システム定義外・本デザインシステム補完値）

### Neutral（ニュートラル）

- **Text Primary** (`#222222`): 本文テキスト（Near Black — 純黒ではなく温かみのある黒）
- **Text Secondary** (`#6a6a6a`): 補足テキスト、ラベル
- **Text Disabled** (`rgba(0,0,0,0.24)`): 無効状態のテキスト
- **Border** (`#c1c1c1`): 区切り線、入力欄の枠
- **Background** (`#ffffff`): ページ背景
- **Surface** (`#f2f2f2`): カード内セカンダリ面、ナビゲーションボタン背景

### Premium（プレミアム階層）

- **Luxe Purple** (`#460479`): 上位プラン向けブランドカラー
- **Plus Magenta** (`#92174d`): 中位プラン向けブランドカラー

---

## 3. Typography Rules

<!-- 日本語タイポグラフィの核心セクション。実サイトのCSSに基づいて正確に記述すること -->

### 3.1 和文フォント

<!-- 使用している和文フォントを優先度順に列挙 -->

- **ゴシック体**: Noto Sans JP, 游ゴシック, ヒラギノ角ゴ ProN W3
- **明朝体**（使用しない）: 該当なし — 本デザインシステムはゴシック統一

### 3.2 欧文フォント

<!-- 和文と組み合わせる欧文フォント -->

- **サンセリフ**: Airbnb Cereal VF, Circular, -apple-system, system-ui, Roboto, Helvetica Neue
- **セリフ**（使用しない）: 該当なし
- **等幅**: SFMono-Regular, Consolas, Menlo

### 3.3 font-family 指定

<!-- 実際のCSS宣言をそのまま記述。フォールバックチェーンの順序が重要 -->

```css
/* 本文（globals.css body）*/
font-family: var(--font-montserrat), var(--font-sans), sans-serif;
/* → Montserrat（Latin/数字）→ Noto Sans JP（和文）→ sans-serif */

/* 見出し（globals.css h1〜h6）*/
font-family: var(--font-sans), var(--font-montserrat), sans-serif;
/* → Noto Sans JP（和文優先）→ Montserrat（Latin）→ sans-serif */

/* 等幅 */
font-family: SFMono-Regular, Consolas, Menlo, monospace;
```

**実装フォント（layout.tsx）:**
- `--font-montserrat`: Montserrat（Google Fonts, weight 400/500/600/700/800）
- `--font-sans`: Noto Sans JP（Google Fonts, weight 400/500/600/700）

**フォールバックの考え方**:
- 和文フォント（Noto Sans JP）を先に指定（日本語の表示品質を優先）
- 欧文フォント（Airbnb Cereal VF / Circular）は和文フォント内の欧文グリフより優先させるため先頭に置かず、和文の後に配置
- 最後に generic family（sans-serif）を指定

### 3.4 文字サイズ・ウェイト階層

<!-- 実際のデザイントークンまたは使用されているサイズを記述 -->

| Role | Font | Size | Weight | Line Height | Letter Spacing | 備考 |
|------|------|------|--------|-------------|----------------|------|
| Display | Noto Sans JP | 28px | 700 | 1.43 | normal | ページタイトル等 |
| Heading 1 | Noto Sans JP | 22px | 600 | 1.18 | -0.44px | セクション見出し |
| Heading 2 | Noto Sans JP | 20px | 600 | 1.20 | -0.18px | サブ見出し |
| Heading 3 | Noto Sans JP | 16px | 600 | 1.25 | normal | 小見出し |
| Body | Noto Sans JP | 14px | 400 | 1.70 | 0.04em | 本文（日本語は広めの行間） |
| Caption | Noto Sans JP | 12px | 400 | 1.33 | normal | 補足、注釈 |
| Small | Noto Sans JP | 11px | 600 | 1.18 | normal | 最小テキスト（バッジ等） |

### 3.5 行間・字間

- **本文の行間 (line-height)**: 1.70（日本語は欧文より広めが標準。元システムの1.43から拡張）
- **見出しの行間**: 1.18〜1.43（元システムのcard heading〜section headingに準拠）
- **本文の字間 (letter-spacing)**: 0.04em（全角文字の可読性向上のため）
- **見出しの字間**: -0.18px〜-0.44px（元システムのnegative trackingに準拠。親密感・温かみを演出）

**ガイドライン**:
- 日本語本文は `line-height: 1.7` 以上を推奨（元システムは欧文用1.43だが日本語向けに拡張）
- `letter-spacing: 0.04em` は全角文字に有効。欧文混じりの場合は欧文にも影響する点に注意
- 見出しの負のletter-spacingは欧文部分のみに適用し、全角文字には視覚的に影響しにくい

### 3.6 禁則処理・改行ルール

```css
/* 推奨設定 */
word-break: break-all;
overflow-wrap: break-word;
line-break: strict;            /* 厳格な禁則処理 */
```

**禁則対象**:
- 行頭禁止: `）」』】〕〉》」】、。，．・：；？！`
- 行末禁止: `（「『【〔〈《「【`

### 3.7 OpenType 機能

```css
font-feature-settings: "palt" 1;  /* プロポーショナル字詰め（見出し・ナビに有効） */
font-feature-settings: "kern" 1;  /* カーニング（欧文・和欧混植時に有効） */
```

- **palt**: 見出し・ナビゲーション要素に適用。本文には適用しない（可読性が低下する場合あり）
- **kern**: 欧文数字・ラテン文字が多いUI要素（価格表示など）に有効
- 元システムでは `"salt"` (stylistic alternates) をバッジ・キャプションに使用。欧文部分に同様の設定を適用可能

### 3.8 縦書き

<!-- 縦書きに対応する場合のみ記述 -->

該当なし

---

## 4. Component Stylings

### Buttons

**Primary（ブランドアクセント）**
- Background: `#ff385c`
- Text: `#ffffff`
- Padding: 0px 24px
- Border Radius: 8px
- Font Size: 16px
- Font Weight: 500
- Hover: `#e00b41`（Deep Rausch）

**Primary Dark（ダークCTA）**
- Background: `#222222`
- Text: `#ffffff`
- Padding: 0px 24px
- Border Radius: 8px
- Font Size: 16px
- Font Weight: 500
- Hover: `#ff385c`（Rausch Red）へのトランジション
- Focus: `0 0 0 2px #222222` ring + scale(0.92)

**Secondary**
- Background: `transparent`
- Text: `#222222`
- Border: 1px solid `#222222`
- Padding: 0px 24px
- Border Radius: 8px

**Circular Nav（カルーセル・ナビ）**
- Background: `#f2f2f2`
- Text: `#222222`
- Border Radius: 50%
- Hover Shadow: `rgba(0,0,0,0.08) 0px 4px 12px`
- Focus: scale(0.92)

### Inputs

- Background: `#ffffff`
- Border: 1px solid `#c1c1c1`
- Border (focus): 1px solid `#ff385c` + `0 0 0 3px rgba(255,56,92,0.5)` ring
- Border Radius: `var(--radius-lg)` = 14px（shadcn `rounded-lg`）
- Padding: `px-2.5 py-1` = 10px 4px（shadcn `h-8` = 32px height）
- Font Size: 14px（`text-sm`）
- Height: 32px（shadcn `h-8`）

### Cards

- Background: `#ffffff`
- Border: なし（シャドウの第1レイヤーが境界線を代替）
- Border Radius: 20px（`rounded-[20px]` 直接指定）
- Padding: 32px（`p-8` = Tailwind）
- Shadow: `.shadow-card` CSS クラス = `rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px`
- Hover Shadow: `.shadow-card:hover` = `rgba(0,0,0,0.08) 0px 4px 12px`

---

## 5. Layout Principles

### Spacing Scale

| Token | Value |
|-------|-------|
| XS | 4px |
| S | 8px |
| M | 16px |
| L | 24px |
| XL | 32px |

ベースユニット: 8px。スケール全体: 2px, 3px, 4px, 6px, 8px, 10px, 11px, 12px, 15px, 16px, 22px, 24px, 32px

### Container

- Max Width: `max-w-6xl` ≈ 1152px（LP主要セクション）/ `max-w-5xl` ≈ 1024px（コンテンツ幅）/ `max-w-3xl` ≈ 768px（ナロー）
- Padding (horizontal): 24px（`px-6`）

### Grid

- Columns: 3（フィーチャーカード・`md:grid-cols-3`）/ 2（料金カード・`md:grid-cols-2`）
- Gutter: 24px（`gap-6`）
- 最大列数（プランカード）: 3列（Desktop）→ 2 → 1

---

## 6. Depth & Elevation

| Level | Shadow | 用途 |
|-------|--------|------|
| 0 | none | フラットな要素、テキストブロック |
| 1 | `rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px` | カード、検索バー（3層シャドウ） |
| 2 | `rgba(0,0,0,0.08) 0px 4px 12px` | ボタンホバー、インタラクティブリフト |
| 3 | `rgb(255,255,255) 0px 0px 0px 4px` + focus ring | アクティブ・フォーカス状態 |

**シャドウの哲学**: 3層構造で温かみのある自然なリフトを再現。
- Layer 1 (`0px 0px 0px 1px` / 0.02): 超微細なボーダーリング
- Layer 2 (`0px 2px 6px` / 0.04): 柔らかなアンビエントシャドウ
- Layer 3 (`0px 4px 8px` / 0.1): 主要なリフト効果

---

## 7. Do's and Don'ts

### Do（推奨）

- フォントは必ずフォールバックチェーンを指定する（Noto Sans JP → Airbnb Cereal VF → system fonts）
- 日本語本文の line-height は 1.7 以上にする（元システムの1.43から日本語向けに拡張）
- 色のコントラスト比は WCAG AA 以上を確保する
- コンポーネントの余白は Spacing Scale（8px基準）に従う
- テキストは `#222222`（温かみのある近黒）を使う — 純黒 `#000000` は使わない
- Rausch Red (`#ff385c`) はCTAとブランドモーメントのみに使う — 面積の広い背景には使わない
- 3層カードシャドウはすべてのエレベートされた面に適用する
- ボーダーラジウスを守る: 8px（ボタン）、20px（カード）、50%（丸型コントロール）
- 見出しのletter-spacingに負値（-0.18px〜-0.44px）を使い、親密感を演出する

### Don't（禁止）

- `font-family` に和文フォント1つだけを指定しない（環境依存になる）
- 日本語本文に `line-height: 1.2` 以下を使わない（可読性が著しく低下する）
- 全角・半角スペースを混在させない
- テキストに純粋な `#000000` を使わない（常に `#222222`）
- Rausch Redを背景や広い面積に使わない（アクセント専用）
- 見出しにウェイト300・400を使わない（最低500）
- シャドウの主要レイヤーに0.1超の不透明度を使わない（温かみが失われる）
- カードの角を0〜4pxにしない（20px以上の寛大な丸みが必須）
- `--palette-*` トークンシステムを上書きしない

---

## 8. Responsive Behavior

### Breakpoints

| Name | Width | 説明 |
|------|-------|------|
| Mobile Small | < 375px | 単列・コンパクト検索 |
| Mobile | 375–550px | 標準モバイルレイアウト |
| Tablet Small | 550–744px | 2列リスティング |
| Tablet | 744–950px | 検索バー拡張 |
| Desktop Small | 950–1128px | 3列リスティング |
| Desktop | 1128–1440px | 4列グリッド・フルヘッダー |
| Large Desktop | 1440–1920px | 5列グリッド |
| Ultra-wide | > 1920px | グリッド最大幅 |

*Airbnb本体は61のブレークポイントを持つ極めて詳細なレスポンシブシステム。本サービスは上記7段階を基本とする。*

### タッチターゲット

- 最小サイズ: 44px × 44px（WCAG基準）
- カルーセルナビ: 50%ラジウスの円形ボタン（十分なタップ領域を確保）
- カード全体をタップターゲットにする（モバイルでの操作性向上）
- カテゴリピル: 横スクロール可能・十分なパディング確保

### フォントサイズの調整

- モバイルでは本文 14px、見出しはデスクトップの 70–80% 程度に縮小
- カテゴリピル: 全サイズで横スクロールを維持

### コラプス戦略

- リスティンググリッド: 5 → 4 → 3 → 2 → 1列
- 検索バー: 展開バー → コンパクトバー → オーバーレイ
- ナビゲーション: フルヘッダー → モバイル簡略版

---

## 9. Agent Prompt Guide

### クイックリファレンス

```
Primary Color: #ff385c（Rausch Red）
Primary Dark: #e00b41（Deep Rausch）
Text Color: #222222（Near Black）
Text Secondary: #6a6a6a
Background: #ffffff
Surface: #f2f2f2
Border: #c1c1c1
Font: "Noto Sans JP", "Airbnb Cereal VF", Circular, -apple-system, sans-serif
Body Size: 14px
Body Line Height: 1.70
Card Shadow: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px
```

### プロンプト例

```
このサービスのデザインシステムに従って、デートプラン一覧カードを作成してください。
- プライマリカラー: #ff385c（CTAボタンのみ）
- フォント: "Noto Sans JP", "Airbnb Cereal VF", sans-serif
- 本文行間: line-height: 1.7
- カード背景: #ffffff、ボーダーラジウス: 20px
- カードシャドウ: rgba(0,0,0,0.02) 0px 0px 0px 1px, rgba(0,0,0,0.04) 0px 2px 6px, rgba(0,0,0,0.1) 0px 4px 8px
- テキスト: #222222（見出し）、#6a6a6a（補足）
- ボーダー: #c1c1c1
- 写真エリアをカード上部に配置し、詳細を下部に
```

### Iteration Guide

1. 白から始める — 写真とプランカードがすべての色を提供する
2. Rausch Red (#ff385c) はCTAのみ — 広い面積には使わない
3. Near Black (#222222) のテキスト — 温かみが重要
4. 3層シャドウで自然なリフトを作る — 必ず3層すべてを使う
5. 寛大なラジウス: 8px（ボタン）、20px（カード）、50%（コントロール）
6. フォントウェイト500〜700 — 見出しに細いウェイトを使わない
7. 写真がヒーロー — すべてのプランカードは画像ファーストで設計する
