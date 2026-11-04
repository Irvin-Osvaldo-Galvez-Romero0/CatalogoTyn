with open('src/App.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace AnatomyView wrapper
old_anatomy = """        <div style={{ display: view === 'anatomy' ? 'flex' : 'none', width: '100%', height: '100%', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          <AnatomyView
            products={allProducts}
            onSelectProduct={(p) => setSelectedProduct(p)}
            interestList={interestList}
            onToggleInterest={handleToggleInterest}
          />
        </div>"""

new_anatomy = """        <div style={{ display: view === 'anatomy' ? 'flex' : 'none', width: '100%', height: '100%', flex: 1, minHeight: 0, flexDirection: 'column' }}>
          <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--brand)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Cargando Anatomía 3D...</div>}>
            <AnatomyView
              products={allProducts}
              onSelectProduct={(p) => setSelectedProduct(p)}
              interestList={interestList}
              onToggleInterest={handleToggleInterest}
            />
          </React.Suspense>
        </div>"""

# Replace MediaOverlay
old_media = """      {mediaState.type && (
        <MediaOverlay
          mediaType={mediaState.type}
          src={mediaState.src}
          title={mediaState.title}
          onClose={handleCloseMedia}
        />
      )}"""

new_media = """      {mediaState.type && (
        <React.Suspense fallback={null}>
          <MediaOverlay
            mediaType={mediaState.type}
            src={mediaState.src}
            title={mediaState.title}
            onClose={handleCloseMedia}
          />
        </React.Suspense>
      )}"""

# Replace AttractMode
old_attract = """      {isAttractMode && (
        <ErrorBoundary onReset={handleDismissAttract}>
          <AttractMode"""

new_attract = """      {isAttractMode && (
        <ErrorBoundary onReset={handleDismissAttract}>
          <React.Suspense fallback={null}>
            <AttractMode"""

old_attract_close = """            onGoToCatalog={() => {
              handleDismissAttract();
              setView('catalog');
            }}
          />
        </ErrorBoundary>
      )}"""

new_attract_close = """            onGoToCatalog={() => {
              handleDismissAttract();
              setView('catalog');
            }}
          />
          </React.Suspense>
        </ErrorBoundary>
      )}"""

text_norm = text.replace('\r\n', '\n')
old_anatomy_norm = old_anatomy.replace('\r\n', '\n')
old_media_norm = old_media.replace('\r\n', '\n')
old_attract_norm = old_attract.replace('\r\n', '\n')
old_attract_close_norm = old_attract_close.replace('\r\n', '\n')

if old_anatomy_norm in text_norm:
    text_norm = text_norm.replace(old_anatomy_norm, new_anatomy)
    print("AnatomyView Suspense added")
else:
    print("old_anatomy_norm not found")

if old_media_norm in text_norm:
    text_norm = text_norm.replace(old_media_norm, new_media)
    print("MediaOverlay Suspense added")
else:
    print("old_media_norm not found")

if old_attract_norm in text_norm:
    text_norm = text_norm.replace(old_attract_norm, new_attract)
    print("AttractMode Suspense open added")
else:
    print("old_attract_norm not found")

if old_attract_close_norm in text_norm:
    text_norm = text_norm.replace(old_attract_close_norm, new_attract_close)
    print("AttractMode Suspense close added")
else:
    print("old_attract_close_norm not found")

with open('src/App.jsx', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text_norm)
print("Finished wrapping in Suspense")
