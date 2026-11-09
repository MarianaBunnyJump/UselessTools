import urllib.request, json, os, sys
from PIL import Image
from io import BytesIO

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"
OUT = os.path.dirname(os.path.abspath(__file__))

# app_id -> (country, list of desired shot indices)
TARGETS = [
    # Direction C
    ("carrot",   591840203, "us", [0, 1, 2]),
    ("sleep",   1194338569, "cn", [0, 1, 2]),
    ("meow",    1483024444, "cn", [0, 1, 2]),
    # Direction D
    ("things",   904237743, "us", [0, 1, 2]),
    ("dida",     626144601, "cn", [0, 1, 2]),
    ("tide",    1077776989, "cn", [0, 1, 2]),
]

def lookup(app_id, country="cn"):
    url = f"https://itunes.apple.com/lookup?id={app_id}&country={country}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))

def upgrade_size(url, w=900):
    # mzstatic: replace the trailing /WxHbb.ext with a larger size
    # e.g. /392x696bb.png -> /900x1600bb.jpg
    import re
    m = re.search(r"/\d+x\d+bb\.(png|jpg|jpeg|webp)$", url)
    if not m:
        return url
    # derive height keeping ~9:19 ratio
    h = int(w * 19 / 9)
    return re.sub(r"/\d+x\d+bb\.\w+$", f"/{w}x{h}bb.jpg", url)

def download(url, dest):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Referer": "https://apps.apple.com/",
        "Accept": "image/avif,image/webp,image/*,*/*;q=0.8",
    })
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    # open with PIL, re-encode to JPEG q80, max width 900
    img = Image.open(BytesIO(data))
    img = img.convert("RGB")
    if img.width > 900:
        nh = int(img.height * 900 / img.width)
        img = img.resize((900, nh), Image.LANCZOS)
    img.save(dest, "JPEG", quality=80, optimize=True)
    return os.path.getsize(dest), img.size

for name, aid, country, idxs in TARGETS:
    try:
        res = lookup(aid, country)
        if not res.get("results"):
            print(f"[FAIL lookup] {name} id={aid} country={country}")
            continue
        app = res["results"][0]
        shots = app.get("screenshotUrls", [])
        print(f"=== {name} ({app.get('trackName')}) — {len(shots)} shots ===")
        for i in idxs:
            if i >= len(shots):
                print(f"  [skip] idx {i} out of range")
                continue
            src = upgrade_size(shots[i], 900)
            dest = os.path.join(OUT, f"{'-'.join(['c' if name in ('carrot','sleep','meow') else 'd', name, str(i+1)])}.jpg")
            try:
                sz, dim = download(src, dest)
                print(f"  ok {os.path.basename(dest)}  {dim}  {sz//1024}KB  <- {src}")
            except Exception as e:
                # fallback: try original 392x696
                try:
                    sz, dim = download(shots[i], dest)
                    print(f"  ok(fallback) {os.path.basename(dest)}  {dim}  {sz//1024}KB")
                except Exception as e2:
                    print(f"  [FAIL] idx {i}: {e} / fallback {e2}")
    except Exception as e:
        print(f"[ERR] {name}: {e}")
