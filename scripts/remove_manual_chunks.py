with open('vite.config.js', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove rollupOptions.output.manualChunks
import re
c_new = re.sub(r'rollupOptions:\s*\{[^}]*output:\s*\{[^}]*manualChunks:[^}]*\}\s*\}\s*\},?', '', c)
# Or simpler:
target = '''    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react'],
          'vendor-confetti': ['canvas-confetti'],
          'vendor-jspdf': ['jspdf', 'jspdf-autotable']
        }
      }
    }'''

c = c.replace(target, '')
with open('vite.config.js', 'w', encoding='utf-8') as f:
    f.write(c)

print("Removed manualChunks from vite.config.js")
