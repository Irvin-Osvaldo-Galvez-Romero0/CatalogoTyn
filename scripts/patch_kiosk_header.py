with open('src/components/KioskHeader.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    if '<img' in line and i + 1 < len(lines) and 'src={logo}' in lines[i + 1]:
        new_lines.append('          <picture>\n')
        new_lines.append('            <source srcSet="/assets/logo.webp" type="image/webp" />\n')
        new_lines.append('            <img\n')
        new_lines.append('              src={logo}\n')
        new_lines.append('              alt="Tynor"\n')
        new_lines.append('              className="kiosk-logo"\n')
        new_lines.append('              width="100"\n')
        new_lines.append('              height="42"\n')
        new_lines.append('              loading="eager"\n')
        new_lines.append('              fetchPriority="high"\n')
        new_lines.append('              decoding="sync"\n')
        new_lines.append('              onError={(e) => { e.currentTarget.src = "/assets/logo.png"; }}\n')
        new_lines.append('            />\n')
        new_lines.append('          </picture>\n')
        skip = True
    elif skip:
        if '/>' in line:
            skip = False
    else:
        new_lines.append(line)

with open('src/components/KioskHeader.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("KioskHeader updated successfully")
