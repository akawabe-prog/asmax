# Codex 指示書: F1 Pro / S2 商品ページ作成

## 概要
`product/eva-r-unit01.html` をテンプレートとして、F1 Pro と S2 の商品ページを作成してください。

## 重要: 購入はAPI連携
このサイトはカスタムジャパンのカートAPIと連携しています。購入ボタンは外部リンクではなく、`GO TO CART`ボタンでAPIカートに追加 → `https://www.customjapan.net/cart?site=asmax`へリダイレクトする方式です。

### API構成（既存ファイル・変更不要）
- `assets/js/api-client.js` — ASMAX用APIクライアント（`site: 'asmax'`）
- `assets/js/services/base-api-requester.js` — API基盤
- `assets/js/services/auth-api-requester.js` — 認証
- `assets/js/services/cart-api-requester.js` — カート操作

### 各商品ページに必要なJS
1. `<script type="module">` で `../assets/js/api-client.js` をインポート
2. `initApiClient()` でAPI初期化
3. `addItemsToCart([{ id: productId, quantity: 1 }])` でカート追加
4. 成功時 `window.location.href = CART_URL` でリダイレクト
5. `window.__variants` に各カラーの `productId` を含める（カスタムジャパンの商品ID）

**テンプレートの `eva-r-unit01.html` にはこの仕組みが実装済みです。**そのまま踏襲してください。

## 作成するファイル
1. `product/f1-pro.html` — F1 Pro（シャイニーグレー / ステラーグレーの2色切替）
2. `product/s2.html` — S2（グレー 1色のみ）

## テンプレートファイル
`product/eva-r-unit01.html` をコピーして差し替えてください。CSS/JS/HTML構造はそのまま維持します。

---

## 共通の変更点（両ファイル共通）

### 1. 削除するセクション
- `.collab-badge`（`ASMAX × EVA RACING` バッジ）→ F1 Pro/S2はコラボモデルではないため削除
- `.sec-concept`（コンセプトビデオセクション全体）→ EVA専用動画のため削除
- 「初号機モデルはこちら / 2号機モデルはこちら」のカラーセクション → 削除（代わりに別モデルナビに変更）

### 2. CSS変更
- EVAカラー変数（`--eva01`, `--eva01-accent`, `--eva02`, `--eva02-accent`）は不要だが残しても問題なし

---

## f1-pro.html の詳細

### メタ情報
```html
<title>F1 Pro | ASMAX JAPAN</title>
<meta name="description" content="ASMAX F1 Pro インカム。シャイニーグレー / ステラーグレーの2色展開。Bluetooth 5.3 デュアルチップ8コア、最大50人CloudTalk、IPX7防水。¥35,915（税込）">
```

### パンくずリスト
```
TOP / Lineup / F1 Pro シャイニーグレー
```
（カラー切替時に動的に変わる）

### 商品情報（デフォルト = シャイニーグレー）
- タイトル: `F1 Pro シャイニーグレー`
- サブタイトル: `F1 Pro インカム シャイニーグレー`
- 品番: `08WS03AFIN017`
- JAN: `—`
- 価格: `¥35,915 税込`

### カラー選択UI（A/B切替）
2色のラジオ切替（EVA R と同じ仕組み）:
- **シャイニーグレー**: swatch色 `#8a8a8a`, ラベル `シャイニーグレー`, 品番 `08WS03AFIN017`
- **ステラーグレー**: swatch色 `#4a5568`, ラベル `ステラーグレー`, 品番 `08WS03AFIN033`

### ギャラリー画像
- サムネイル1: `../assets/F1 Pro インカム シャイニーグレー.jpg`（デフォルト）
- サムネイル2: なし（ポスターアートがないため、サムネイルは1枚のみ）
- カラー切替時にメイン画像を差し替え

### 購入リンク
- シャイニーグレー: `https://moto.customjapan.net/i/29159420`
- ステラーグレー: `https://moto.customjapan.net/i/29159413`

### JS variants データ（`window.__variants`）
```javascript
window.__variants = {
  a: {
    title: 'F1 Pro シャイニーグレー',
    subtitle: 'F1 Pro インカム シャイニーグレー',
    sku: '08WS03AFIN017',
    img: '../assets/F1 Pro インカム シャイニーグレー.jpg',
    specSku: '08WS03AFIN017',
    specJan: '—',
    specColor: 'シャイニーグレー',
    productId: '29159420',
    storeUrl: 'https://moto.customjapan.net/i/29159420',
    rakutenUrl: '',
    yahooUrl: '',
    breadcrumb: 'F1 Pro シャイニーグレー',
    specSub: 'F1 Pro シャイニーグレー 製品仕様'
  },
  b: {
    title: 'F1 Pro ステラーグレー',
    subtitle: 'F1 Pro インカム ステラーグレー',
    sku: '08WS03AFIN033',
    img: '../assets/F1 Pro インカム ステラーグレー.jpg',
    specSku: '08WS03AFIN033',
    specJan: '—',
    specColor: 'ステラーグレー',
    productId: '29159413',
    storeUrl: 'https://moto.customjapan.net/i/29159413',
    rakutenUrl: '',
    yahooUrl: '',
    breadcrumb: 'F1 Pro ステラーグレー',
    specSub: 'F1 Pro ステラーグレー 製品仕様'
  }
};
```

### Features（4カード）
```
01: Dual Chip / Octa-Core
    Bluetooth 5.3 デュアルチップ・8コアで安定したマルチデバイス通信。メッシュとCloudTalkが自動切替。

02: CloudTalk / Max 50 Riders
    携帯回線経由で最大50人のリアルタイム通話。距離無制限で他社インカム（B+COM・SENA・Cardo）とも接続可能。

03: Hi Max / AI Voice Assistant
    「Hi Max」と話しかけるだけでハンズフリー操作。走行中も安全にすべての機能をコントロール。

04: Magnetic Mount / 3-Second Snap
    マグネット式マウントで工具不要。約3秒で着脱できる簡単設計。
```

### スペック表
```
品番:           08WS03AFIN017（動的）
JANコード:      —（動的）
カラー:         シャイニーグレー（動的）
Bluetooth:      5.3 デュアルチップ・8コア
Mesh通話:       最大10人（FW更新で16人）
CloudTalk:      最大50人（距離無制限）
通信距離:       約3km（Mesh）
連続通話:       約14時間
バッテリー:     1,350mAh
急速充電:       10分充電で約3時間通話
スピーカー:     40mm
音声操作:       Hi Max（オフラインAIアシスタント）
ノイズキャンセル: ENC（環境ノイズキャンセリング）
防水・防塵:     IPX7
本体寸法:       86 × 27 × 23 mm
重量:           50g
マウント:       マグネット式
充電端子:       USB Type-C
対応アプリ:     ASMAX WORLD（iOS / Android）
保証:           メーカー2年保証
```

### 付属品（What's in the Box）
EVA R と同一:
- F1 Pro 本体、マグネットマウント、スピーカーユニット、3M粘着プレート、メタルクランプ、ハイブリッドマイク、有線マイク、USB Type-Cケーブル、クリーニングパック、取扱説明書

### Other Models セクション
EVA R の「2号機モデルもチェック」に相当する部分。以下2カードを表示:
- EVA R 初号機 → `eva-r-unit01.html`（画像: `../assets/Future 1 インカム EVA R 初号機-A パープル.jpg`）
- S2 → `s2.html`（画像: `../assets/S2 インカム グレー.jpg`）

### FAQ
```
Q: F1 ProとEVA Rの違いは何ですか？
A: スペックはほぼ同等です。EVA RはF1 Proをベースに、エヴァンゲリオンコラボの限定デザインとBluetooth 5.4を搭載した日本限定モデルです。

Q: シャイニーグレーとステラーグレーの違いは？
A: カラーデザインの違いのみです。機能・スペックはすべて共通です。

Q: 他社インカム（B+COM、SENA等）と接続できますか？
A: はい、CloudTalkモードで他社インカムとも接続可能です。距離制限もありません。

Q: Arai / SHOEI のヘルメットに取り付けできますか？
A: はい。国内主要メーカーのヘルメットに対応しています。マグネット式マウントで工具不要。

Q: 保証・返品について教えてください。
A: 2年間の製品保証付き。お届けから30日以内の返品対応。
```

---

## s2.html の詳細

### メタ情報
```html
<title>S2 | ASMAX JAPAN</title>
<meta name="description" content="ASMAX S2 インカム グレー。Bluetooth 5.4 デュアルチップ4コア、最大8人Mesh通話、CloudTalk最大50人、IPX7防水。¥15,899（税込）">
```

### 重要な違い: カラー切替なし
S2は1色（グレー）のみのため、**カラー選択UIは不要**。
- `.color-section` を削除
- JSの `window.__variants` を以下のように1色のみに:
```javascript
window.__variants = {
  a: {
    title: 'S2',
    subtitle: 'S2 インカム グレー',
    sku: '08WS04AFIN017',
    img: '../assets/S2 インカム グレー.jpg',
    specSku: '08WS04AFIN017',
    specJan: '—',
    specColor: 'グレー',
    productId: '29159437',
    storeUrl: 'https://moto.customjapan.net/i/29159437',
    rakutenUrl: '',
    yahooUrl: '',
    breadcrumb: 'S2 グレー',
    specSub: 'S2 グレー 製品仕様'
  }
};
```
- `switchColor()` 関数は残してもよいが呼ばれない
- `data-variant` 属性のある要素を削除

### 商品情報
- タイトル: `S2`
- サブタイトル: `S2 インカム グレー`
- 品番: `08WS04AFIN017`
- JAN: `—`
- 価格: `¥15,899 税込`
- product-role（タグ）: `Entry`（EVAの`Icon`やF1 Proの`All-Rounder`に相当するバッジがあれば）

### ギャラリー画像
- メイン画像のみ: `../assets/S2 インカム グレー.jpg`
- サムネイル: 1枚のみ（または非表示）

### 購入リンク
- `https://moto.customjapan.net/i/29159437`

### Features（4カード）
```
01: Ultra Light / 41g
    わずか41gの超軽量ボディ。長時間のツーリングでも疲れにくいコンパクト設計。

02: Mesh + CloudTalk
    メッシュ通信で最大8人、CloudTalkで最大50人の通話に対応。距離無制限で仲間とつながる。

03: Quick Charge / 60min Full
    60分でフル充電完了。10分の急速充電で約3時間の通話が可能。忙しい朝でもすぐ出発。

04: Entry Price / ¥15,899
    必要十分な機能を備えながら、手の届きやすいエントリー価格。はじめてのインカムに最適。
```

### スペック表
```
品番:           08WS04AFIN017
JANコード:      —
カラー:         グレー
Bluetooth:      5.4 デュアルチップ・クアッドコア
Mesh通話:       最大8人
CloudTalk:      最大50人（距離無制限）
通信距離:       約2km（Mesh）
連続通話:       約13時間
音楽再生:       最大17時間
待機時間:       最大96時間
バッテリー:     980mAh
急速充電:       10分→3時間通話 / 60分フル充電
スピーカー:     40mm
ノイズキャンセル: ENC（環境ノイズキャンセリング）
防水・防塵:     IPX7
本体寸法:       86.1 × 39.2 × 24 mm
重量:           41g
マウント:       ロック式（バッククリップ）
充電端子:       USB Type-C
対応アプリ:     ASMAX WORLD（iOS / Android）
保証:           メーカー2年保証
```

### 付属品
EVA R/F1 Pro とほぼ同一だが、マウントがロック式のため:
- S2 本体、ロック式マウント、スピーカーユニット、3M粘着プレート、メタルクランプ、ハイブリッドマイク、有線マイク、USB Type-Cケーブル、クリーニングパック、取扱説明書

### Other Models セクション
- EVA R 初号機 → `eva-r-unit01.html`
- F1 Pro → `f1-pro.html`

### FAQ
```
Q: S2とF1 Proの違いは何ですか？
A: S2はエントリーモデルで、メッシュ最大8人/通信距離2km。F1 Proはメッシュ最大10人/通信距離3km、Hi Max音声操作に対応しています。

Q: 他社インカム（B+COM、SENA等）と接続できますか？
A: はい、ユニバーサルペアリングとCloudTalkで他社インカムとも接続可能です。

Q: Arai / SHOEI のヘルメットに取り付けできますか？
A: はい。国内主要メーカーのヘルメットに対応しています。ロック式マウントで安定した装着が可能です。

Q: バッテリーはどのくらい持ちますか？
A: 連続通話約13時間、音楽再生約17時間、待機最大96時間です。60分でフル充電できます。

Q: 保証・返品について教えてください。
A: 2年間の製品保証付き。お届けから30日以内の返品対応。
```

---

## index.html のリンク更新

作成後、`index.html` の以下のリンクを更新してください:

### Lineup セクションの View Details リンク
- F1 Pro シャイニーグレー: `href="product/f1-pro.html"`
- F1 Pro ステラーグレー: `href="product/f1-pro.html"`
- S2: `href="product/s2.html"`

### Footer の Products リンク
```html
<a href="product/eva-r-unit01.html">EVA R 初号機</a>
<a href="product/eva-r-unit02.html">EVA R 2号機</a>
<a href="product/f1-pro.html">F1 Pro</a>
<a href="product/s2.html">S2</a>
```

---

## デザインルール（厳守）

1. **CSS変数はすべてテンプレートと同一**（:root のデザイントークンを変更しない）
2. **画像は `mix-blend-mode: lighten` + 黒背景**（白背景の商品写真をダークテーマに馴染ませる）
3. **アニメーションは `[data-animate]` + IntersectionObserver**（テンプレートのJSをそのまま維持）
4. **フォント**: Inter（英数）+ Noto Sans JP（日本語）
5. **レスポンシブ**: 1024px以下で1カラム、768px以下でグリッド調整

## ファイル確認
作成後、以下を確認してください:
- 画像パスがすべて `../assets/` で始まっている
- 外部リンク（カスタムジャパン等）に `target="_blank" rel="noopener"` がある
- カラー切替（F1 Pro）で画像・品番・CTA URLが正しく切り替わる
- S2はカラー切替UIが存在しない
- ナビゲーションリンク（TOP, Lineup, Compare, Support）が `../index.html` を指している
