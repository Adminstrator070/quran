#!/usr/bin/env python3
"""Downloads the Quran (Amiri Quran) and UI (Tajawal) fonts into fonts/ and writes css/fonts.css, so the app never needs Google Fonts.
Usage: python3 tools/fetch_fonts.py"""
import os, re, urllib.request
CSS = "https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Tajawal:wght@400;500;700&display=swap"
UA = {"User-Agent": "Mozilla/5.0 (Linux; Android 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"}
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read()
css = get(CSS).decode()
os.makedirs("fonts", exist_ok=True); os.makedirs("css", exist_ok=True)
def local(m):
    url = m.group(1); name = re.sub(r"[^A-Za-z0-9]", "", url.split("/")[-1])[-48:] + ".woff2"
    open("fonts/" + name, "wb").write(get(url)); return "url(../fonts/" + name + ")"
open("css/fonts.css", "w").write(re.sub(r"url\((https://[^)]+)\)", local, css))
print("fonts saved:", len(os.listdir("fonts")))
