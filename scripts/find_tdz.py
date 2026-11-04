with open('dist/assets/vendor-react-CQnfuI1V.js', 'r', encoding='utf-8') as f:
    code = f.read()

lines = code.split('\n')
print(f"Total lines: {len(lines)}")
# In minified files, line 24 might be the entire file or a huge block.
# Let's search for "Cannot access 'I' before initialization" - what is `I`?
# In ES modules, TDZ occurs when an imported variable is accessed before its declaration or circular re-export.
import re
# Let's find imports and exports
imports = re.findall(r'import\s*\{[^}]+\}\s*from\s*[\'"][^\'"]+[\'"]', code)
print("Imports count:", len(imports))
for imp in imports:
    print(" ", imp)

exports = re.findall(r'export\s*\{[^}]+\}', code)
print("Exports count:", len(exports))
for exp in exports:
    print(" ", exp[:100])
