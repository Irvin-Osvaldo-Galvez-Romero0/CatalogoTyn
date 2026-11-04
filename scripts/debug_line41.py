with open('dist/assets/index-CF20ODCB.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Total lines:", len(lines))
if len(lines) >= 41:
    print("Line 41 context:")
    line = lines[40] # 0-indexed 40 = line 41
    print(line[:500])
    # Find all occurrences of ' d ' or ' d.' or ' d,' or '(d)'
    import re
    matches = [m.start() for m in re.finditer(r'\bd\b', line)]
    print(f"Total 'd' occurrences: {len(matches)}")
    for idx in matches[:5]:
        print("Slice:", line[max(0, idx-50):min(len(line), idx+50)])
