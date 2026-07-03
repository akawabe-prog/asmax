#!/usr/bin/env python3
"""カスタムジャパン公式CMS(WordPress)から法務コンテンツを取得し、ASMAXサイトの
法務ページ(特商法・プライバシーポリシー・利用規約)を生成する。

ソース: https://cms.customjapan.net/wp-json/wp/v2/posts/{id}
  666 = ご利用規約 / 668 = プライバシーポリシー / 672 = 特定商取引法に基づく表記
(SPconnect_Branding/scripts/build_legal_pages.mjs と同じ取得元)

使い方: python3 scripts/build-legal.py
"""
import json, re, urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CMS = "https://cms.customjapan.net/wp-json/wp/v2/posts/{}?_fields=id,title,content,modified"
CJ = "https://www.customjapan.net"

PAGES = [
    {"id": 672, "file": "legal.html",   "title": "特定商取引法に基づく表記", "en": "LEGAL",
     "lead": "ASMAX JAPAN公式ストア(運営: 株式会社カスタムジャパン)の特定商取引法に基づく表示事項です。"},
    {"id": 668, "file": "privacy.html", "title": "プライバシーポリシー", "en": "PRIVACY POLICY",
     "lead": "株式会社カスタムジャパンの個人情報保護方針です。本サイトのご利用・ご注文にはこちらが適用されます。"},
    {"id": 666, "file": "terms.html",   "title": "ご利用規約", "en": "TERMS OF SERVICE",
     "lead": "株式会社カスタムジャパンが提供する通信販売サービスのご利用条件です。"},
]

def fetch(pid):
    with urllib.request.urlopen(CMS.format(pid), timeout=30) as r:
        return json.loads(r.read())

def clean(html):
    # 相対リンクを本体サイトの絶対URLへ / ありがちなtypo修正 / 空要素除去
    html = html.replace('href="/', f'href="{CJ}/')
    html = html.replace('https://wwww.customjapan.net', CJ)
    html = re.sub(r'<a ', f'<a target="_blank" rel="noopener" ', html)
    html = re.sub(r'<p>\s*(&nbsp;)?\s*</p>', '', html)
    return html.strip()

TPL = '''<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | ASMAX JAPAN</title>
<meta name="description" content="{lead}">
<meta name="robots" content="noindex, follow">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/atmos-sub.css">
<style>
.legal-doc{{max-width:860px}}
.legal-doc h1,.legal-doc h2,.legal-doc h3,.legal-doc h4{{font-size:clamp(17px,1.9vw,22px);font-weight:900;margin:40px 0 14px;padding-top:24px;border-top:1px solid var(--line);line-height:1.5}}
.legal-doc h1:first-child,.legal-doc h2:first-child{{border-top:0;padding-top:0;margin-top:0}}
.legal-doc p{{color:var(--sub);font-size:14px;line-height:2;margin:0 0 16px}}
.legal-doc ul,.legal-doc ol{{margin:0 0 20px;padding-left:1.5em;color:var(--sub);font-size:14px;line-height:2}}
.legal-doc table{{width:100%;border-collapse:collapse;margin:20px 0 26px;font-size:14px}}
.legal-doc th,.legal-doc td{{border:1px solid var(--line);padding:13px 16px;text-align:left;vertical-align:top;line-height:1.9}}
.legal-doc th{{width:30%;background:var(--bg2);font-weight:800;white-space:nowrap}}
.legal-doc td{{color:var(--sub)}}
.legal-doc a{{color:var(--accent);font-weight:700}}
@media(max-width:680px){{.legal-doc th,.legal-doc td{{display:block;width:100%}}.legal-doc th{{border-bottom:0}}}}
.legal-meta{{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:30px}}
.legal-meta span{{font-size:11.5px;font-weight:700;color:var(--sub);border:1px solid var(--line);border-radius:99px;padding:6px 14px;background:var(--card)}}
.legal-tabs{{display:flex;gap:8px;flex-wrap:wrap;margin-top:24px}}
.legal-tabs a{{font-size:12px;font-weight:700;border:1px solid var(--line);border-radius:99px;padding:8px 18px;color:var(--sub);transition:.25s}}
.legal-tabs a:hover,.legal-tabs a.on{{color:var(--accent);border-color:var(--accent);background:var(--accent-dim)}}
</style>
</head>
<body class="aero">

<section class="page-hero">
  <div class="wrap">
    <p class="eyebrow rv">{en}</p>
    <h1 class="rv" data-d="1" style="font-size:clamp(26px,3.4vw,42px)">{title}</h1>
    <p class="lead rv" data-d="2">{lead}</p>
    <nav class="legal-tabs rv" data-d="3">
      <a href="legal.html"{on_legal}>特定商取引法に基づく表記</a>
      <a href="privacy.html"{on_privacy}>プライバシーポリシー</a>
      <a href="terms.html"{on_terms}>ご利用規約</a>
      <a href="shipping.html">配送・返品・保証</a>
    </nav>
  </div>
</section>

<section class="sec wrap" style="padding-top:1vh">
  <div class="legal-doc rv">
    <div class="legal-meta"><span>株式会社カスタムジャパン</span><span>最終更新: {modified}</span><span>ページ生成: {today}</span></div>
{extra_top}{content}
  </div>
</section>

<footer></footer>
<script src="../assets/js/atmos-sub.js"></script>
</body>
</html>
'''

ASMAX_TOKUSHOHO_EXTRA = '''    <table>
      <tr><th>販売サイト</th><td>ASMAX JAPAN 公式サイト(本サイト)/ 決済・配送は「カスタムジャパン」オンラインストアにて行います。</td></tr>
      <tr><th>本サイトでの特典</th><td>ASMAX JAPAN公式ストアでご購入いただいた製品本体は、メーカー保証が通常2年から4年に延長されます。詳細は<a href="shipping.html">配送・返品・保証</a>をご覧ください。</td></tr>
    </table>
'''

for p in PAGES:
    post = fetch(p["id"])
    content = clean(post["content"]["rendered"])
    # 特商法: URL行はカスタムジャパン表記のまま(運営者の公式表記)。ASMAX補足は上部の表に。
    html = TPL.format(
        title=p["title"], en=p["en"], lead=p["lead"],
        modified=post["modified"][:10], today=date.today().isoformat(),
        content=content,
        extra_top=ASMAX_TOKUSHOHO_EXTRA if p["id"] == 672 else "",
        on_legal=' class="on"' if p["file"] == "legal.html" else "",
        on_privacy=' class="on"' if p["file"] == "privacy.html" else "",
        on_terms=' class="on"' if p["file"] == "terms.html" else "",
    )
    (ROOT / "pages" / p["file"]).write_text(html)
    print(f'wrote pages/{p["file"]} ({p["title"]}, 更新{post["modified"][:10]}, {len(content)}文字)')
