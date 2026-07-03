#!/usr/bin/env python3
"""asmax/(クリーンURLビルド)を本番同等に配信するローカル確認サーバ。
拡張子なしキーを text/html で返す(本番のS3系配信を再現)。
使い方: python3 scripts/serve-clean.py [port=8095]
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "asmax"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8095

class CleanHandler(SimpleHTTPRequestHandler):
    def guess_type(self, path):
        # 拡張子なしファイルはHTMLとして配信(本番の拡張子なしキー配信を再現)
        if "." not in Path(path).name:
            return "text/html; charset=utf-8"
        return super().guess_type(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

ThreadingHTTPServer(("127.0.0.1", PORT), partial(CleanHandler, directory=str(ROOT))).serve_forever()
