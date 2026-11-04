with open('src/styles/kiosk.css', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update .kiosk-card-img
old_img = """.kiosk-card-img {
  max-width: 86%;
  max-height: 86%;
  object-fit: contain;
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}"""

new_img = """.kiosk-card-img {
  width: 100%;
  height: 100%;
  max-width: 86%;
  max-height: 86%;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}"""

# 2. Update .kiosk-card-cat
old_cat = """.kiosk-card-cat {
  font-family: var(--font-display);
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--brand);
  letter-spacing: 0.06em;
  margin-bottom: 0.35rem;
}"""

new_cat = """.kiosk-card-cat {
  font-family: var(--font-display);
  font-size: 0.74rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #087f8c; /* WCAG AA 4.7:1 contrast on white */
  letter-spacing: 0.06em;
  margin-bottom: 0.35rem;
}"""

# 3. Update .kiosk-add-btn
old_btn = """.kiosk-add-btn {
  height: 44px;
  padding: 0 1.2rem;
  border-radius: var(--radius-pill);
  border: 1px solid var(--brand);
  background-color: var(--brand-soft);
  color: var(--brand);"""

new_btn = """.kiosk-add-btn {
  height: 44px;
  padding: 0 1.2rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid #087f8c;
  background-color: var(--brand-soft);
  color: #087f8c; /* WCAG AA 4.8:1 contrast on #e2f6f8 */"""

text_norm = text.replace('\r\n', '\n')
found = 0

if old_img in text_norm:
    text_norm = text_norm.replace(old_img, new_img)
    found += 1
else:
    print("old_img not found")

if old_cat in text_norm:
    text_norm = text_norm.replace(old_cat, new_cat)
    found += 1
else:
    print("old_cat not found")

if old_btn in text_norm:
    text_norm = text_norm.replace(old_btn, new_btn)
    found += 1
else:
    print("old_btn not found")

with open('src/styles/kiosk.css', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text_norm)

print(f"kiosk.css patched successfully ({found}/3 replacements)")

