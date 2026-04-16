# ASMAX JAPAN — Design Implementation Prompt for Claude Code

> **用途**: Claude Code に渡してサイト実装を依頼するためのプロンプト
> **対象ファイル**: `ASMAX_TOP_Wireframe.html`（単一HTMLファイル、CSS/JS インライン）
> **制約**: 外部フレームワーク不使用。Google Fonts + CDN ライブラリのみ許可。

---

## 0. このプロンプトの目的

あなたは ASMAX JAPAN（バイク用インターコム日本総代理店）のTOPページを実装します。
**最も重要な指示**: 「AIが生成したっぽい」ありきたりなダークモードサイトにしないこと。
以下に「やってはいけないパターン」と「代わりにやるべきこと」を具体的に定義します。

---

## 1. ブランドコンテキスト

| 項目 | 内容 |
|------|------|
| ブランド | ASMAX — 2004年創業のライダーズインターコムブランド |
| サイト | asmax.customjapan.net（日本総代理店公式） |
| トーン | ASMAX本体（asmaxworld.com）と同じ温度感。テック×ライダー。クール＆プレミアム |
| 目玉商品 | EVA R（EVANGELION RACING コラボ）初号機 / 2号機 |
| 他商品 | F1 Pro（高機能オールラウンダー）、S2（エントリー・低価格） |
| 言語 | 日本語メイン、見出し・ラベルは英語 |

---

## 2. 「AIっぽい」デザインの禁止パターン（ANTI-PATTERNS）

以下はAIがCSSを書くときに陥りがちなパターンです。**すべて回避してください。**

### 2-1. 均一カードグリッドの量産
```
❌ やりがち:
.grid { grid-template-columns: repeat(3, 1fr); gap: 24px; }
→ 同じサイズのカードが3枚、同じパディング、同じ角丸、同じシャドウ

✅ 代わりに:
- カードのサイズ・形を意図的に変える（1枚だけ大きい、1枚は横長など）
- グリッドの列幅を非対称にする（1.4fr 1fr、2fr 1fr 1fr など）
- 一部のカードだけボーダーを持たせ、他は持たせない
```

### 2-2. 全要素に同じ border-radius
```
❌ やりがち:
すべてのカード、ボタン、入力欄、画像に border-radius: 24px;

✅ 代わりに:
- ボタン: 12px（小さいUI）
- メインカード: 20–28px（大きい面）
- アクセント要素: 0（角ばりで緊張感）
- 混在させることでリズムが生まれる
```

### 2-3. 同一シャドウの使い回し
```
❌ やりがち:
--shadow: 0 24px 80px rgba(0,0,0,0.45);
→ すべてのカードに同じ shadow を適用

✅ 代わりに:
- 3段階のシャドウレベルを定義:
  --shadow-sm: 0 4px 16px rgba(0,0,0,0.2);
  --shadow-md: 0 16px 48px rgba(0,0,0,0.3);
  --shadow-lg: 0 32px 80px rgba(0,0,0,0.45);
- 情報の重要度に応じて使い分ける
```

### 2-4. backdrop-filter: blur() の乱用
```
❌ やりがち:
ヘッダー、ボタン、カード、バッジ、ドロワー… すべてに blur

✅ 代わりに:
- blur はヘッダーの1箇所のみ
- 他はソリッドな背景色（rgba の透過率を下げる）
- 「ガラス風」は1要素に絞ることで特別感が出る
```

### 2-5. すべて同じイージング・同じデュレーション
```
❌ やりがち:
transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
→ すべてのインタラクションが同じ速度・同じカーブ

✅ 代わりに:
- 即座のフィードバック（ボタンホバー）: 0.15s ease-out
- 入場アニメーション: 0.8s cubic-bezier(0.16, 1, 0.3, 1)
- 大きな要素のトランジション: 1.2s cubic-bezier(0.25, 1, 0.5, 1)
- スケール変化: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)（やや弾む）
- 意図を持って使い分ける
```

### 2-6. 機械的なディレイ間隔
```
❌ やりがち:
--delay: 0.04s → 0.08s → 0.12s → 0.16s（等間隔 0.04s 刻み）

✅ 代わりに:
- 不等間隔: 0s → 0.06s → 0.15s → 0.2s → 0.28s
- 重要な要素ほどディレイが短い（早く見える）
- グループ単位でまとめて出す（カード3枚が0.05s差で連続→次のグループまで0.3s空く）
```

### 2-7. linear-gradient の金太郎飴
```
❌ やりがち:
background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
→ すべてのカードに同じ微妙なグラデーション

✅ 代わりに:
- 一部のカードはフラットな単色（rgba(255,255,255,0.03) のみ）
- アクセントカードだけグラデーション付き
- 背景のグラデーションと要素のグラデーションを被らせない
```

### 2-8. eyebrow → h2 → p → grid の繰り返し構造
```
❌ やりがち:
すべてのセクションが:
<div class="eyebrow">ラベル</div>
<h2>見出し</h2>
<p>説明</p>
<div class="grid">カード×N</div>
→ スクロールしても同じリズムの繰り返し

✅ 代わりに:
- セクションごとにレイアウトを変える:
  - フルワイド1カラム → 2カラム非対称 → カード3枚 → テーブル → フルブリード画像
- eyebrow は全セクションに付けない（3つに1つ程度）
- 見出しの位置を変える（左寄せ → 中央 → 右寄せ）
```

---

## 3. デザイン原則（DO THIS）

### 3-1. エディトリアルペーシング
雑誌のように、セクションごとに「呼吸」を変える。

```
HERO: 静寂。テキストだけ。85vh。余白が主役。
EVA R INTRO: 劇場。フルスクリーン中央タイポグラフィ。
EVA R CARDS: 没入。フルブリード2カラム、80vh。パディング大。
LINEUP: 情報。コンパクトなカードグリッド。密度を上げる。
COMPARE: 機能。テーブル。装飾を削ぎ落とす。
YOUR MATCH: 提案。非対称レイアウト。
WHY ASMAX: 信頼。タイトなリスト、アイコン不使用。
BRAND STORY: 物語。大きな画像＋テキスト。
REVIEWS: 証拠。小さめカード、密度高め。
APP: プロダクト。デバイスモックアップ＋最小限コピー。
FAQ: 実用。アコーディオン。
CTA: 締め。背景変化で切り替えを演出。
```

### 3-2. タイポグラフィドリブン
デバイス画像が揃うまでは、タイポグラフィで勝負する。

```css
/* ヒーロー見出し: 巨大・トラッキング広め */
.hero h1 {
  font-size: clamp(3.5rem, 10vw, 9rem);
  letter-spacing: -0.02em;  /* タイト（大きい文字はタイトに） */
  line-height: 0.88;
}

/* セクション見出し: 中サイズ・やや広め */
.section h2 {
  font-size: clamp(2rem, 4vw, 3.8rem);
  letter-spacing: 0.02em;
}

/* 小見出し・ラベル: 小さく・広いトラッキング */
.eyebrow {
  font-size: 11px;
  letter-spacing: 0.22em;
}

/* ポイント: 大きい文字ほど letter-spacing を狭く。小さい文字ほど広く。 */
```

### 3-3. 余白のリズム
均一にしない。セクション間の余白に強弱をつける。

```css
/* セクション間余白: 3段階 */
--space-section-lg: 160px;  /* HEROの後、CTAの前など「場面転換」 */
--space-section-md: 96px;   /* 通常のセクション間 */
--space-section-sm: 64px;   /* 関連セクション間（compare → your match） */

/* コンテンツ内余白: 黄金比に近い比率 */
--space-xs: 8px;
--space-sm: 13px;
--space-md: 21px;
--space-lg: 34px;
--space-xl: 55px;
--space-2xl: 89px;
```

### 3-4. カラー: 制限と強調
```css
:root {
  /* ベース: 3色で構成 */
  --bg: #0a0a0a;
  --surface: #141414;
  --text: #e0e0e0;
  --muted: #6a6a6a;  /* 少し暗めに。808080は明るすぎ */
  --white: #f5f5f5;  /* 純白 #fff は避ける。少しだけ落とす */

  /* アクセント: 使用は全体の5%以下 */
  --accent: #ff6b00;

  /* EVA: セクション限定 */
  --eva01: #7b2d8e;
  --eva02: #c82828;
}

/* ルール:
   - accent は CTA ボタンと重要なリンクのみ
   - EVA カラーは EVA セクション外では使わない
   - ボーダーの白は 0.06–0.1 の opacity（0.12 は明るすぎ）
*/
```

### 3-5. モーション: 意味のある動き
```css
/* 入場: 下から浮き上がる（デフォルト） */
[data-animate] {
  opacity: 0;
  transform: translateY(32px);
  transition:
    opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 入場: スケール（カード・画像向け） */
[data-animate="scale"] {
  opacity: 0;
  transform: scale(0.96);
}

/* 入場: 左からスライド（テキストブロック向け） */
[data-animate="slide-left"] {
  opacity: 0;
  transform: translateX(-40px);
}

/* ホバー: 素早い（即座のフィードバック） */
.btn { transition: all 0.18s ease-out; }

/* ホバー: カードは少し遅め（余韻） */
.card { transition: transform 0.45s cubic-bezier(0.25, 1, 0.5, 1); }

/* ルール:
   - IntersectionObserver で発火。threshold: 0.15
   - 画面内に入ったら .is-visible クラス付与 → unobserve
   - ディレイは CSS custom property --d で個別指定
*/
```

---

## 4. セクション別 実装指示

### SEC-01: HERO
```
レイアウト: フルワイド、min-height: 85vh、左寄せ
要素:
  - eyebrow: "ASMAX JAPAN Official"
  - h1: "Connect Your Every Adventure"（max 9rem、line-height 0.88）
  - subcopy: 1–2行のキャッチコピー
  - ghost-btn 1つ: "EVA R コラボを見る"
  - hero-note: 「正規品 / 日本語サポート / 2年間保証 / 30日間返品無料」
  - scroll-indicator: 下矢印

背景: body 直下の radial-gradient のみ。セクション自体は透過。
装飾: 一切なし。テキストと余白だけで構成。
```

### SEC-02: EVA R INTRO（フルスクリーン見出し）
```
レイアウト: 中央配置、min-height: 80vh
背景: ダーク + 紫×赤のグラデーション + pulse アニメーション（6s）
要素:
  - eyebrow: "ASMAX x Evangelion Racing"
  - h2: "初号機 × 2号機"（各色付き、max 7rem）
  - lede: 1行のキャッチ

上端に 3px のグラデーションライン（紫→赤）+ box-shadow で光らせる。
```

### SEC-03: EVA R CARDS（フルブリード2カラム）
```
レイアウト: grid 2カラム、gap: 0、各カード min-height: 80vh
カード間: 1px の縦線（rgba(255,255,255,0.06)）
内容（各カード）:
  - topline: 型番 / スペックサマリー
  - device-solo: CSSデバイスシルエット（220×280px）
  - h3 + description
  - 価格 + Buy Now / 詳しく見る
ホバー: ユニットカラーが背景に淡く浮かぶ（rgba 0.04）
モバイル: 縦積み、60vh、横線区切りに切替
```

### SEC-04: LINEUP（4商品カード）
```
レイアウト: 2カラム（EVA R 2枚が上段で大きい、F1 Pro / S2 が下段）
featured カード: min-height: 520px、product-visual 280px、h3 28px、price 30px
通常カード: デフォルトサイズ
ホバー: translateY(-4px) + shadow 強化
```

### SEC-05: COMPARE（スペック比較テーブル）
```
水平スクロール対応テーブル。
最左列を sticky。
装飾は最小限: 行間の 1px ボーダーのみ。
```

### SEC-06: YOUR MATCH
```
3カラム。ただし完全均等ではなく、中央カードのみやや大きめ（1.1fr 1fr 1fr）でもよい。
各カード: ユーザーペルソナ → おすすめ商品リンク
```

### SEC-07: WHY ASMAX JAPAN
```
3カラム × 2行 = 6項目。
ナンバリング（01–06）は大きく薄く表示。
カードではなくリスト風でもよい — ボーダーを下にだけ引くスタイル。
```

### SEC-08: BRAND STORY
```
2カラム非対称（画像エリア : テキスト = 1fr : 0.9fr）
左: ビジュアルエリア（タイムライン付き）
右: 見出し + 本文 + Read More ボタン
```

### SEC-09: RIDERS VOICE
```
4カラム（1280px以上）→ 2カラム → 1カラム
各カード: SNSソース + ユーザー名 + 引用テキスト
カードは小さめ、密度を上げる。
```

### SEC-10: APP
```
2カラム（テキスト : ビジュアル = 1fr : 1fr）
左: 見出し「1つのアプリで、すべてを管理。」+ 説明文 + App Store バッジ
右: CSSスマートフォンモックアップ（ダイナミックアイランド付き）
アクセントカラーのグロー下部配置。
モバイル: 縦積み中央揃え
```

### SEC-11: FAQ
```
max-width: 840px 中央配置。
アコーディオン形式。+ / × アイコン。
最初の1問だけ開いた状態。
```

### SEC-12: CTA BAND
```
背景に radial-gradient でアクセントカラーの光。
中央配置: 見出し + 説明 + accent ボタン + ghost ボタン + モールリンク
```

---

## 5. 全体構成ルール

### ファイル構造
```
単一 HTML ファイル（<style> + <script> インライン）
外部依存: Google Fonts（Inter + Noto Sans JP）のみ
画像: すべて CSS で描画するか、asmaxworld.com の CDN URL を使用
```

### レスポンシブ
```
ブレークポイント:
  1280px: 4カラム → 2カラム
  1024px: ナビ非表示 → ハンバーガー、2カラム → 1カラム
  768px: パディング縮小、フォントサイズ縮小

アプローチ: モバイルファーストではなくデスクトップファーストで記述し、
max-width メディアクエリで縮小。
```

### アクセシビリティ
```
- セマンティックHTML（section, article, nav, main, footer）
- aria-label をナビ・ボタンに
- フォーカス可視（:focus-visible）
- prefers-reduced-motion 対応
```

### パフォーマンス
```
- Google Fonts は preconnect + display=swap
- IntersectionObserver は1つだけ生成、全 [data-animate] 要素を observe
- 不要な JS ライブラリは使わない
```

---

## 6. 最終チェックリスト

実装完了後、以下をセルフレビューすること:

- [ ] 同じ border-radius が5箇所以上連続していないか
- [ ] 同じ box-shadow 変数がすべてのカードに使われていないか
- [ ] backdrop-filter: blur がヘッダー以外で使われていないか
- [ ] すべてのセクションが eyebrow → h2 → p → grid の同一構造になっていないか
- [ ] transition のイージングが全箇所同じになっていないか
- [ ] animation-delay が等間隔 (0.04s刻み等) になっていないか
- [ ] 隣接するセクションの padding が完全に同じ値になっていないか
- [ ] accent カラーが画面の5%以上の面積を占めていないか
- [ ] EVA カラーが EVA セクション外で使われていないか
- [ ] スクロールして見たとき、同じリズムが3回以上連続していないか

---

## 7. 参考 — 目指すべきサイトのイメージ

テック感と洗練を両立しているブランドサイトの方向性:

- **Nothing Phone** — ダークベース、点描的なドットパターン、タイポグラフィ主導
- **Teenage Engineering** — ミニマル、グリッド打破、プロダクトの存在感
- **Linear** — 情報密度が高いのに整理されている、モーション控えめ
- **Arc Browser** — 色使いが大胆だが品がある、エディトリアル感
- **SENA (sena.com)** — ライダー市場の競合。ダークベースだが写真主導で差別化

ASMAXはこれらの中間 — **Linearの情報設計 × Nothing Phoneの視覚言語** が最も近い。

---

*このプロンプトは ASMAX JAPAN サイト（asmax.customjapan.net）の TOP ページ実装用です。*
*作成日: 2026-04-13*
