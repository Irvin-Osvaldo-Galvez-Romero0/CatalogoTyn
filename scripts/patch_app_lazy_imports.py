with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove top-level confetti import
content = content.replace("import confetti from 'canvas-confetti';", "")

# 2. Add triggerConfetti helper
helper = '''
const triggerConfetti = (opts) => {
  import('canvas-confetti').then((m) => {
    const fire = m.default || m;
    fire(opts);
  }).catch(() => {});
};
'''

content = content.replace("const INACTIVITY_TIMEOUT_MS = 60000;", helper + "\nconst INACTIVITY_TIMEOUT_MS = 60000;")

# 3. Replace confetti(...) with triggerConfetti(...)
content = content.replace("confetti({", "triggerConfetti({")

# 4. Replace static import of MobileQuoteLanding with React.lazy
content = content.replace(
    "import MobileQuoteLanding from './components/MobileQuoteLanding';",
    "const MobileQuoteLanding = React.lazy(() => import('./components/MobileQuoteLanding'));"
)

# 5. Wrap MobileQuoteLanding in Suspense
target_render = '''  if (mobileQuoteData) {
    return (
      <MobileQuoteLanding
        quoteData={mobileQuoteData}
      />
    );
  }'''

replacement_render = '''  if (mobileQuoteData) {
    return (
      <React.Suspense fallback={null}>
        <MobileQuoteLanding
          quoteData={mobileQuoteData}
        />
      </React.Suspense>
    );
  }'''

content = content.replace(target_render, replacement_render)

with open('src/App.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("App.jsx patched successfully")

