with open('src/styles/kiosk.css', 'r', encoding='utf-8') as f:
    text = f.read()

old_pulse = """@keyframes pulseGreen {
  0%, 100% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 8px #10B981;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
    box-shadow: 0 0 16px #10B981, 0 0 24px rgba(16, 185, 129, 0.5);
  }
}"""

new_pulse = """@keyframes pulseGreen {
  0%, 100% {
    transform: scale(1);
    opacity: 0.75;
  }
  50% {
    transform: scale(1.25);
    opacity: 1;
  }
}"""

text_norm = text.replace('\r\n', '\n')
old_norm = old_pulse.replace('\r\n', '\n')

if old_norm in text_norm:
    text_norm = text_norm.replace(old_norm, new_pulse)
    with open('src/styles/kiosk.css', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(text_norm)
    print("SUCCESS patching pulseGreen in kiosk.css")
else:
    print("old_norm not found in kiosk.css")
