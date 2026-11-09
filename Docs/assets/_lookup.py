import urllib.request, json, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

def lookup(term=None, app_id=None, country="cn"):
    if app_id:
        url = f"https://itunes.apple.com/lookup?id={app_id}&country={country}"
    else:
        url = f"https://itunes.apple.com/search?term={urllib.parse.quote(term)}&entity=software&country={country}&limit=5"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode("utf-8"))
    return data

if __name__ == "__main__":
    import urllib.parse
    # Search by term
    term = sys.argv[1]
    country = sys.argv[2] if len(sys.argv) > 2 else "cn"
    res = lookup(term=term, country=country)
    for a in res.get("results", []):
        print("---")
        print("id:", a.get("trackId"))
        print("name:", a.get("trackName"))
        print("dev:", a.get("artistName"))
        print("url:", a.get("trackViewUrl"))
        shots = a.get("screenshotUrls", [])
        print("shots count:", len(shots))
        for s in shots[:6]:
            print("  ", s)
