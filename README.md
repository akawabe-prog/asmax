# ASMAX ReBranding

ASMAXブランド向けの静的Webサイト制作プロジェクトです。  
トップページ、会社情報、店舗情報、プロダクト一覧・詳細ページで構成されています。

## 構成

- `index.html`: トップページ
- `about.html`: 会社情報
- `stores.html`: 店舗情報
- `cloudtalk-mode.html`: CloudTalkモード紹介
- `product/`: 商品一覧・商品詳細ページ
- `assets/`: 画像・動画・CSS・JavaScript

## ローカル確認

任意の静的サーバーで確認できます。例:

```bash
python3 -m http.server 8080
```

ブラウザで `http://localhost:8080` を開いて表示確認してください。

## デプロイ/公開

このリポジトリは `main` ブランチを GitHub に push して運用します。

```bash
git add .
git commit -m "Update site"
git push
```

## 注意事項

- 画像・動画は容量が大きいため、差分確認時に変更対象を明確にしてください。
- API連携用のスクリプトは `assets/js/` 配下にあります。
