with open('dist/assets/vendor-icons-jxntS4K7.js', 'r', encoding='utf-8') as f:
    code = f.read()
import re
print("Imports in vendor-icons:")
for imp in re.findall(r'import\s*\{[^}]+\}\s*from\s*[\'"][^\'"]+[\'"]', code):
    print(" ", imp)
