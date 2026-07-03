#!/usr/bin/env python3
"""取扱店舗の住所を国土地理院APIでジオコーディングし、stores-data.js に lat/lng を付与する。
- キャッシュ: data/stores-geocache.json(再実行時はキャッシュ優先)
- フォールバック: 全文で見つからない場合は住所を段階的に短くして再検索
使い方: python3 scripts/geocode-stores.py
"""
import json, re, time, urllib.request, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JS_PATH = ROOT / "assets/js/stores-data.js"
CACHE = ROOT / "data/stores-geocache.json"
UA = {"User-Agent": "ASMAX-store-locator/1.0"}

def geocode(q):
    url = "https://msearch.gsi.go.jp/address-search/AddressSearch?q=" + urllib.parse.quote(q)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=15) as r:
        d = json.loads(r.read())
    if d:
        lng, lat = d[0]["geometry"]["coordinates"]
        return round(lat, 6), round(lng, 6)
    return None

def variants(addr):
    a = re.sub(r"\s+", "", addr)
    yield a
    yield re.sub(r"[−ー\-]\d+([−ー\-]\d+)*$", "", a)          # 末尾の番地を落とす
    yield re.sub(r"\d.*$", "", a)                                # 最初の数字以降を落とす

src = JS_PATH.read_text()
m = re.search(r"window\.ASMAX_STORES = (\[.*?\]);", src, re.S)
stores = json.loads(m.group(1))
cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}

ok = ng = 0
for s in stores:
    addr = s["address"]
    if addr in cache:
        hit = cache[addr]
    else:
        hit = None
        for v in variants(addr):
            try:
                hit = geocode(v)
            except Exception:
                time.sleep(1)
                continue
            if hit:
                break
            time.sleep(0.12)
        cache[addr] = hit
        time.sleep(0.12)
    if hit:
        s["lat"], s["lng"] = hit
        ok += 1
    else:
        ng += 1
        print("  miss:", s["name"], addr)

CACHE.parent.mkdir(exist_ok=True)
CACHE.write_text(json.dumps(cache, ensure_ascii=False))
JS_PATH.write_text("// 2りんかん取扱店舗データ(座標は国土地理院APIで付与)\nwindow.ASMAX_STORES = " + json.dumps(stores, ensure_ascii=False) + ";\n")
print(f"\ngeocoded: {ok} / miss: {ng} / total: {len(stores)}")
