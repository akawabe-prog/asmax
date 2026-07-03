#!/usr/bin/env python3
"""本番アップ用フォルダ `asmax/` を必要資源のみで組み立てる。

- 本番は「asmaxフォルダをそのままアップする」運用のため、公開に必要な
  HTML/CSS/JS/画像/データだけをコピーする(_legacy・scripts・生データ等は含めない)
- コピー後に全HTML/JS/CSSの参照を走査し、リンク切れが無いことを検証する

使い方: python3 scripts/build-deploy.py
出力:   ./asmax/  (git管理外)
"""
import re, shutil, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "asmax"

# ── コピー対象(公開に必要な資源のみ) ──
COPY_DIRS = [
    "shop",
    "pages",
    "assets/v3",
    "assets/products",
    "assets/instagram",
    "assets/manuals",
    "assets/press",
    "assets/js/services",
]
COPY_FILES = [
    "index.html",
    "top-v3.html",                 # 旧URL用リダイレクト
    "data/instagram-tieup.json",   # タイアップ枠(index.htmlがfetch)
    "assets/css/atmos-sub.css",
    "assets/js/api-client.js",
    "assets/js/atmos-sub.js",
    "assets/js/stores-data.js",
    "assets/js/store-dots.js",
    # ルート直下assets(参照スキャン結果に基づく)
    "assets/ASMAX_LOGO_WHITE.svg",
    "assets/ASMAXworld_app.webp",
    "assets/event-tokyo-motorcycle-show-2026.jpg",
    "assets/f1-pro-stellar-new.png",
    "assets/f1-pro-shiny-new.png",
    "assets/ride-night.jpg",
]

def build():
    if OUT.exists():
        shutil.rmtree(OUT)
    for d in COPY_DIRS:
        shutil.copytree(ROOT / d, OUT / d)
    for f in COPY_FILES:
        dest = OUT / f
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / f, dest)

def verify():
    """asmax/ 内のHTML/JS/CSSを走査し、ローカル参照の実在を確認"""
    pat = re.compile(
        r'''(?:src|href|poster)=["']([^"']+)["']|url\(['"]?([^'")]+)['"]?\)'''
    )
    ok, missing = 0, []
    for f in list(OUT.rglob("*.html")) + list(OUT.rglob("*.css")):
        s = f.read_text(encoding="utf-8", errors="ignore")
        for m in pat.finditer(s):
            u = next(g for g in m.groups() if g)
            if u.startswith(("http", "//", "data:", "#", "mailto", "${")):
                continue
            u = u.split("#")[0].split("?")[0]
            if not u:
                continue
            target = (f.parent / u).resolve()
            try:
                target.relative_to(OUT.resolve())
            except ValueError:
                missing.append(f"{f.relative_to(OUT)} → {u} (フォルダ外参照)")
                continue
            # クリーンURL: 拡張子なしファイル or ディレクトリ参照(→index)を許容
            if target.exists() or Path(str(target) + ".html").exists() or (target.is_dir() and (target / "index.html").exists()):
                ok += 1
            elif u.endswith("/") or u in ("./", "../"):
                base = (f.parent / u).resolve()
                if (base / "index.html").exists():
                    ok += 1
                else:
                    missing.append(f"{f.relative_to(OUT)} → {u}")
            else:
                missing.append(f"{f.relative_to(OUT)} → {u}")
    return ok, missing

def clean_urls():
    """内部リンクの .html を除去し、拡張子なしコピーを併置する(SPconnect方式)。
    本番は拡張子なしキー配信のため、/pages/support のようなクリーンURLで到達できる。
    """
    html_files = sorted(OUT.rglob("*.html"))
    # 既知ページのベース名(誤置換防止のホワイトリスト)
    names = {p.stem for p in html_files}
    # name.html(?/#/引用符直前)を name に。index.html はディレクトリ参照に。
    pat = re.compile(r'(?P<path>[A-Za-z0-9_\-\./]*?)(?P<name>[A-Za-z0-9_\-]+)\.html(?=["\'?#])')

    def repl(m):
        name = m.group("name")
        path = m.group("path")
        if name not in names:
            return m.group(0)
        if path.startswith(("http", "//")):
            return m.group(0)
        if name == "index":
            return (path if path else "./")
        return path + name

    targets = html_files + [OUT / "assets/js/atmos-sub.js"]
    for f in targets:
        s = f.read_text(encoding="utf-8")
        s = pat.sub(repl, s)
        f.write_text(s, encoding="utf-8")
    # 拡張子なしコピー(同ディレクトリに併置)
    for f in html_files:
        shutil.copy2(f, f.with_suffix(""))

build()
clean_urls()
ok, missing = verify()
size = sum(p.stat().st_size for p in OUT.rglob("*") if p.is_file())
n = sum(1 for p in OUT.rglob("*") if p.is_file())
print(f"asmax/ 生成完了: {n}ファイル / {size/1e6:.1f}MB / 参照OK {ok}件")
if missing:
    print("⚠ リンク切れ:")
    for m in missing:
        print("  -", m)
    sys.exit(1)
print("リンク切れなし ✓")
