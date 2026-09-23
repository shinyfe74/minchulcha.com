import json

with open("contents/publications.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("pubs_summary.txt", "w", encoding="utf-8") as out:
    idx = 0
    for pub_type, entries in data.items():
        out.write(f"=== {pub_type} ===\n")
        for entry in entries:
            year = entry.get("Year", "")
            for p in entry.get("Publication", []):
                idx += 1
                materials = p.get("materials", [])
                mat_urls = [f"{m.get('type')}: {m.get('url')}" for m in materials]
                out.write(f"[{idx}] ({year}) [{p.get('type')}] {p.get('title')}\n")
                out.write(f"     Venue: {p.get('venue')} ({p.get('year')})\n")
                out.write(f"     Paper URL: {p.get('url')}\n")
                out.write(f"     Materials: {', '.join(mat_urls)}\n")
                out.write(f"     Keywords: {', '.join(p.get('keyword', []))}\n\n")
