#!/usr/bin/env python3
"""Downloads Hisn al-Muslim (all 132 chapters) from api.islamic.app into data/adhkar.json so the app works offline
and never depends on the API at runtime.  Usage:  python3 tools/fetch_adhkar.py"""
import json, sys, time, urllib.request
B = "https://api.islamic.app/v1/dhikr"
def get(u):
    for i in range(4):
        try:
            req = urllib.request.Request(u, headers={"User-Agent": "mishkat-app/1.0"})
            return json.load(urllib.request.urlopen(req, timeout=30))["data"]
        except Exception as e:
            time.sleep(1.5 * (i + 1)); err = e
    raise err
cats = get(B)["categories"]
out = {"c": [{"number": c["number"], "ar": c.get("ar", ""), "en": c.get("en", ""), "count": c.get("count", 0)} for c in cats], "d": {}}
for c in cats:
    n = str(c["number"])
    duas = get(f"{B}/{n}")["duas"]
    out["d"][n] = [{"n": d.get("number"), "t": (d.get("ar") or {}).get("text", "").strip(), "r": d.get("repeatCount"), "s": ((d.get("source") or {}).get("ar"))} for d in duas]
    print(n, len(duas), file=sys.stderr)
json.dump(out, open("data/adhkar.json", "w"), ensure_ascii=False, separators=(",", ":"))
print("saved data/adhkar.json", len(out["d"]), "chapters")
