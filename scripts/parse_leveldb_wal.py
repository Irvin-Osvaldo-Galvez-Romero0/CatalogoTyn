with open('scripts/tablet_000003.log', 'rb') as f:
    raw = f.read()

pos = 0
matches = []
needle = 'pending_leads'.encode('utf-16le')
while True:
    idx = raw.find(needle, pos)
    if idx == -1:
        break
    matches.append(idx)
    pos = idx + len(needle)

print(f"Total de apariciones en WAL: {len(matches)}")
for idx in matches:
    print(f"\nOffset: {idx}")
    chunk = raw[idx - 20: idx + 800]
    s = chunk.decode('utf-16le', errors='replace')
    print(s.encode('ascii', errors='backslashreplace').decode('ascii'))
