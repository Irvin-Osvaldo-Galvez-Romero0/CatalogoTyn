with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/components/admin/AdminDashboardModal.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
inserted = False
for i, line in enumerate(lines):
    new_lines.append(line)
    if 'value={productForm.sizes}' in line and not inserted:
        # Check if next line has placeholder
        pass
    if i > 5 and 'value={productForm.sizes}' in lines[i-4] and '</div>' in line and not inserted:
        price_by_size_jsx = """
                    {/* Precios Diferenciados por Medida / Talla (priceBySize) */}
                    <div style={{ gridColumn: 'span 2', padding: '1rem', background: 'var(--bg-surface-raised)', borderRadius: '14px', border: '1px solid var(--border)' }}>
                      <div style={{ marginBottom: '0.6rem' }}>
                        <strong style={{ fontSize: '0.9rem', color: 'var(--ink)', display: 'block' }}>
                          Precios Específicos por Medida / Talla ($ MXN)
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--ink-faint)' }}>
                          Asigna un precio diferente a tallas específicas (ej. XL/XXL a $240 y CH/M/G a $225). Si se deja vacío, tomará el Precio Base.
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem' }}>
                        {(typeof productForm.sizes === 'string'
                          ? productForm.sizes.split(',').map((s) => s.trim()).filter(Boolean)
                          : (productForm.sizes || [])
                        ).map((sizeKey) => (
                          <div key={sizeKey} style={{ background: 'var(--bg-surface)', padding: '0.5rem 0.65rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand)', display: 'block', marginBottom: '0.25rem' }}>
                              Talla {sizeKey}:
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              placeholder={productForm.price || '0.00'}
                              value={productForm.priceBySize?.[sizeKey] ?? ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setProductForm((prev) => ({
                                  ...prev,
                                  priceBySize: {
                                    ...(prev.priceBySize || {}),
                                    [sizeKey]: val === '' ? undefined : Number(val)
                                  }
                                }));
                              }}
                              style={{
                                width: '100%',
                                height: 32,
                                padding: '0 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border)',
                                fontSize: '0.85rem',
                                fontWeight: 700
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
"""
        new_lines.append(price_by_size_jsx)
        inserted = True

with open('c:/Users/User/Documents/GitHub/CatalogoTyn/src/components/admin/AdminDashboardModal.jsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Success, priceBySize UI inserted:', inserted)
