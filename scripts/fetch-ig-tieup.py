#!/usr/bin/env python3
"""ASMAX JAPAN (@asmax_japan) のタイアップ投稿を取得してTOP表示用に書き出す。

- Graph API のタグ付けメディア({ig-user-id}/tags)= 他アカウントがASMAXをタグ付けした投稿
- 自社投稿のうちタイアップ系キーワードを含むもの
を統合し、画像をローカルへ保存(IGのCDN URLは失効するため)して
data/instagram-tieup.json を生成する。

トークンは insta_ads/.env (META_ACCESS_TOKEN) をビルド時のみ使用。コミットしない。
使い方: python3 scripts/fetch-ig-tieup.py
"""
import json, os, re, ssl, sys, urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENV_PATH = Path("/Users/cjmac002/Desktop/insta_ads/.env")
IG_USER_ID = "17841478409604223"  # ASMAX JAPAN (旧asmax_cj → 現asmax_japan)
API_VER = "v25.0"
OUT_JSON = ROOT / "data" / "instagram-tieup.json"
IMG_DIR = ROOT / "assets" / "instagram"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
CTX = ssl.create_default_context()
TIEUP_WORDS = ["タイアップ", "提供", "PR", "広告", "協賛", "コラボ", "アンバサダー", "モニター", "#pr", "#sponsored", "#ad"]

def load_env(path):
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30, context=CTX) as r:
        return json.loads(r.read())

def dl(url, dest):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
            data = r.read()
        if len(data) < 1000:
            return False
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"  ! dl failed: {e}")
        return False

def is_tieup(caption):
    c = (caption or "").lower()
    return any(w.lower() in c for w in TIEUP_WORDS)

load_env(ENV_PATH)
TOKEN = os.environ.get("META_ACCESS_TOKEN")
if not TOKEN:
    sys.exit("META_ACCESS_TOKEN not found")

base = f"https://graph.facebook.com/{API_VER}/{IG_USER_ID}"
fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username"

posts = []
# 1) タグ付け投稿(=他アカウントによるタイアップ/UGC)
try:
    tagged = get_json(f"{base}/tags?fields={fields}&limit=50&access_token={TOKEN}")
    for m in tagged.get("data", []):
        m["source"] = "tagged"
        posts.append(m)
    print(f"tagged: {len(tagged.get('data', []))}")
except Exception as e:
    print(f"tags fetch failed: {e}")

# 2) 自社投稿(タイアップ語を含むもの or 予備)
try:
    own = get_json(f"{base}/media?fields={fields}&limit=30&access_token={TOKEN}")
    for m in own.get("data", []):
        m["source"] = "own"
        posts.append(m)
    print(f"own: {len(own.get('data', []))}")
except Exception as e:
    print(f"media fetch failed: {e}")

IMG_DIR.mkdir(parents=True, exist_ok=True)
out = []
for m in posts:
    url = m.get("media_url") or m.get("thumbnail_url")
    if m.get("media_type") == "VIDEO":
        url = m.get("thumbnail_url") or url
    if not url:
        continue
    pid = m["id"]
    dest = IMG_DIR / f"{pid}.jpg"
    if not dest.exists():
        if not dl(url, dest):
            continue
    cap = (m.get("caption") or "").strip()
    out.append({
        "id": pid,
        "username": m.get("username", ""),
        "source": m["source"],
        "tieup": is_tieup(cap) or m["source"] == "tagged",
        "caption": cap[:120],
        "permalink": m.get("permalink", ""),
        "timestamp": m.get("timestamp", ""),
        "img": f"assets/instagram/{pid}.jpg",
        "media_type": m.get("media_type", ""),
    })

out.sort(key=lambda x: x["timestamp"], reverse=True)
OUT_JSON.parent.mkdir(exist_ok=True)
OUT_JSON.write_text(json.dumps({
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "account": "asmax_japan",
    "count": len(out),
    "posts": out,
}, ensure_ascii=False, indent=1))
print(f"\nwrote {OUT_JSON} ({len(out)} posts, tieup={sum(1 for p in out if p['tieup'])})")
