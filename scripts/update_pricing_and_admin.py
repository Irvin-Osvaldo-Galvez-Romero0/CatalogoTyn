import re

# 1. Update src/services/productManager.js
with open('src/services/productManager.js', 'r', encoding='utf-8') as f:
    pm_code = f.read()

if 'priceBySize: productData.priceBySize' not in pm_code:
    pm_code = pm_code.replace(
        "price: productData.price != null && productData.price !== '' ? Number(productData.price) : 0,",
        "price: productData.price != null && productData.price !== '' ? Number(productData.price) : 0,\n      priceBySize: productData.priceBySize || null,"
    )
    with open('src/services/productManager.js', 'w', encoding='utf-8') as f:
        f.write(pm_code)
    print("Updated productManager.js successfully.")
else:
    print("productManager.js already updated.")

# 2. Update src/components/ProductDetailModal.jsx
with open('src/components/ProductDetailModal.jsx', 'r', encoding='utf-8') as f:
    pdm_code = f.read()

# Update modal-price
old_price_block = '<div className="modal-price">{formatPrice(product.price)}</div>'
new_price_block = '''<div className="modal-price">
            {activeSize && product.priceBySize?.[activeSize] != null
              ? formatPrice(product.priceBySize[activeSize])
              : formatPrice(product.price)}
            {product.priceBySize && Object.keys(product.priceBySize).length > 0 && !activeSize && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink-secondary)', marginLeft: '0.5rem' }}>
                (Precio varía según medida)
              </span>
            )}
          </div>'''
pdm_code = pdm_code.replace(old_price_block, new_price_block)

# Update size button display
old_size_btn = '''                  {product.sizes.map((s) => {
                    const isSelected = activeSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setActiveSize(s);
                          setValidationError('');
                        }}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--brand)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--brand-muted, rgba(16,180,193,0.12))' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--brand)' : 'var(--ink)',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}'''

new_size_btn = '''                  {product.sizes.map((s) => {
                    const isSelected = activeSize === s;
                    const sizeTariff = product.priceBySize?.[s];
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setActiveSize(s);
                          setValidationError('');
                        }}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--brand)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--brand-muted, rgba(16,180,193,0.12))' : 'var(--bg-surface)',
                          color: isSelected ? 'var(--brand)' : 'var(--ink)',
                          fontWeight: isSelected ? 800 : 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <span>{s}</span>
                        {sizeTariff != null && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: isSelected ? 'var(--brand)' : '#059669',
                            background: isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(5, 150, 105, 0.08)',
                            padding: '1px 5px',
                            borderRadius: '4px'
                          }}>
                            {formatPrice(sizeTariff)}
                          </span>
                        )}
                      </button>
                    );
                  })}'''
pdm_code = pdm_code.replace(old_size_btn, new_size_btn)

# Update badge in combination item
old_badge = '''                        {product.priceBySize?.[v.size] && (
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.08)', padding: '1px 6px', borderRadius: '4px', marginLeft: '0.2rem' }}>
                            
                          </span>
                        )}'''
new_badge = '''                        {product.priceBySize?.[v.size] && (
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.08)', padding: '1px 6px', borderRadius: '4px', marginLeft: '0.2rem' }}>
                            {formatPrice(product.priceBySize[v.size])} c/u
                          </span>
                        )}'''
pdm_code = pdm_code.replace(old_badge, new_badge)

with open('src/components/ProductDetailModal.jsx', 'w', encoding='utf-8') as f:
    f.write(pdm_code)
print("Updated ProductDetailModal.jsx successfully.")

# 3. Update src/components/admin/AdminDashboardModal.jsx
with open('src/components/admin/AdminDashboardModal.jsx', 'r', encoding='utf-8') as f:
    adm_code = f.read()

# Update payload in handleSaveProduct
old_payload = '''      const payload = {
        ...productForm,
        sizes: parsedSizes.length > 0 ? parsedSizes : ['Universal']
      };'''

new_payload = '''      const payload = {
        ...productForm,
        sizes: parsedSizes.length > 0 ? parsedSizes : ['Universal'],
        price: productForm.price != null && productForm.price !== '' ? Number(productForm.price) : 0,
        priceBySize: Object.keys(productForm.priceBySize || {}).length > 0 ? productForm.priceBySize : null
      };'''

if old_payload in adm_code:
    adm_code = adm_code.replace(old_payload, new_payload)

# Insert Precios Específicos por Talla UI right after Tallas input
old_sizes_input_div = '''                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Tallas Disponibles (separadas por coma)
                      </label>
                      <input
                        type="text"
                        value={productForm.sizes}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                        placeholder="CH, M, G, XL o Universal"
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                    </div>'''

new_sizes_input_with_pricing = '''                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--ink-secondary)' }}>
                        Tallas Disponibles (separadas por coma)
                      </label>
                      <input
                        type="text"
                        value={productForm.sizes}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                        placeholder="CH, M, G, XL o Universal"
                        style={{ width: '100%', height: 44, padding: '0 0.8rem', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.95rem' }}
                      />
                    </div>

                    {/* Precios específicos por Talla / Medida */}
                    <div style={{ gridColumn: 'span 2', padding: '1rem', background: 'var(--bg-surface-raised)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--ink)', display: 'block' }}>Precios Específicos por Medida / Talla (Opcional)</strong>
                          <span style={{ fontSize: '0.76rem', color: 'var(--ink-faint)' }}>
                            Si algunas tallas (ej. XL, XXL o Especial) tienen precio diferente al precio base (${productForm.price || '0.00'}), asígnalo aquí:
                          </span>
                        </div>
                      </div>

                      {(() => {
                        const parsedList = typeof productForm.sizes === 'string'
                          ? productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean)
                          : (Array.isArray(productForm.sizes) ? productForm.sizes : []);
                        
                        if (parsedList.length === 0) {
                          return (
                            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--ink-faint)', fontStyle: 'italic' }}>
                              Escribe las tallas arriba separadas por coma para definir tarifas personalizadas por medida.
                            </p>
                          );
                        }

                        return (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
                            {parsedList.map((sz) => {
                              const customPrice = productForm.priceBySize?.[sz] ?? '';
                              const hasCustom = customPrice !== '' && customPrice !== undefined;
                              return (
                                <div
                                  key={sz}
                                  style={{
                                    background: 'var(--bg-surface)',
                                    border: hasCustom ? '1.5px solid var(--brand)' : '1px solid var(--border)',
                                    borderRadius: '10px',
                                    padding: '0.5rem 0.6rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.3rem'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: hasCustom ? 'var(--brand)' : 'var(--ink)' }}>{sz}</span>
                                    {hasCustom && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const nextMap = { ...(productForm.priceBySize || {}) };
                                          delete nextMap[sz];
                                          setProductForm({ ...productForm, priceBySize: nextMap });
                                        }}
                                        title="Quitar precio especial y volver al base"
                                        style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0, fontSize: '0.75rem', fontWeight: 700 }}
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ position: 'absolute', left: 7, fontSize: '0.8rem', color: 'var(--ink-faint)', fontWeight: 700 }}>$</span>
                                    <input
                                      type="number"
                                      step="0.01"
                                      placeholder={productForm.price || '0.00'}
                                      value={customPrice}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        const nextMap = { ...(productForm.priceBySize || {}) };
                                        if (val === '') {
                                          delete nextMap[sz];
                                        } else {
                                          nextMap[sz] = Number(val);
                                        }
                                        setProductForm({ ...productForm, priceBySize: nextMap });
                                      }}
                                      style={{
                                        width: '100%',
                                        height: 32,
                                        padding: '0 0.4rem 0 1.25rem',
                                        borderRadius: '6px',
                                        border: '1px solid var(--border)',
                                        fontSize: '0.82rem',
                                        fontWeight: hasCustom ? 800 : 500,
                                        color: hasCustom ? '#059669' : 'var(--ink)',
                                        background: 'var(--bg-surface)'
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>'''

if old_sizes_input_div in adm_code:
    adm_code = adm_code.replace(old_sizes_input_div, new_sizes_input_with_pricing)
    with open('src/components/admin/AdminDashboardModal.jsx', 'w', encoding='utf-8') as f:
        f.write(adm_code)
    print("Updated AdminDashboardModal.jsx successfully.")
else:
    print("Could not find old_sizes_input_div in AdminDashboardModal.jsx.")
