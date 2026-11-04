with open('src/components/KioskHeader.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_logo = """          <img
            src={logo}
            alt="Tynor"
            className="kiosk-logo"
            onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
          />"""

new_logo = """          <img
            src={logo}
            alt="Tynor"
            className="kiosk-logo"
            width="140"
            height="42"
            onError={(e) => { e.currentTarget.src = '/assets/logo.png'; }}
          />"""

text_norm = text.replace('\r\n', '\n')
old_norm = old_logo.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_logo)
    with open('src/components/KioskHeader.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print("SUCCESS patching KioskHeader.jsx with logo dimensions")
else:
    print("old_norm not found in KioskHeader.jsx")
