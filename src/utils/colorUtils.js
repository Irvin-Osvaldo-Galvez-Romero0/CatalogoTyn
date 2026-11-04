/**
 * Utilidades para normalización y manejo de colores en el Catálogo Tynor
 */

export const STANDARD_COLORS = {
  'naranja neón': { id: 'N', name: 'Naranja Neón', hex: '#FF6B00', border: '#EA580C' },
  'naranja neon': { id: 'N', name: 'Naranja Neón', hex: '#FF6B00', border: '#EA580C' },
  'naranja': { id: 'N', name: 'Naranja Neón', hex: '#FF6B00', border: '#EA580C' },
  'n': { id: 'N', name: 'Naranja Neón', hex: '#FF6B00', border: '#EA580C' },

  'verde neón': { id: 'V', name: 'Verde Neón', hex: '#10B981', border: '#059669' },
  'verde neon': { id: 'V', name: 'Verde Neón', hex: '#10B981', border: '#059669' },
  'verde': { id: 'V', name: 'Verde Neón', hex: '#10B981', border: '#059669' },
  'v': { id: 'V', name: 'Verde Neón', hex: '#10B981', border: '#059669' },

  'negro (black)': { id: 'NEGRO', name: 'Negro (Black)', hex: '#1E293B', border: '#0F172A' },
  'negro': { id: 'NEGRO', name: 'Negro', hex: '#1E293B', border: '#0F172A' },
  'black': { id: 'NEGRO', name: 'Negro (Black)', hex: '#1E293B', border: '#0F172A' },
  'neg': { id: 'NEGRO', name: 'Negro', hex: '#1E293B', border: '#0F172A' },
  'ne': { id: 'NEGRO', name: 'Negro', hex: '#1E293B', border: '#0F172A' },

  'plata': { id: 'PLATA', name: 'Plata', hex: '#CBD5E1', border: '#94A3B8' },
  'pla': { id: 'PLATA', name: 'Plata', hex: '#CBD5E1', border: '#94A3B8' },
  'silver': { id: 'PLATA', name: 'Plata', hex: '#CBD5E1', border: '#94A3B8' },

  'oro': { id: 'ORO', name: 'Oro', hex: '#D97706', border: '#B45309' },
  'gold': { id: 'ORO', name: 'Oro', hex: '#D97706', border: '#B45309' },

  'amarillo': { id: 'AMARILLO', name: 'Amarillo', hex: '#EAB308', border: '#CA8A04' },
  'amarilla': { id: 'AMARILLO', name: 'Amarillo', hex: '#EAB308', border: '#CA8A04' },

  'rojo': { id: 'ROJO', name: 'Rojo', hex: '#EF4444', border: '#DC2626' },
  'roja': { id: 'ROJO', name: 'Rojo', hex: '#EF4444', border: '#DC2626' },

  'azul': { id: 'AZUL', name: 'Azul', hex: '#3B82F6', border: '#2563EB' },
  'blue': { id: 'AZUL', name: 'Azul', hex: '#3B82F6', border: '#2563EB' },

  'gris': { id: 'GRIS', name: 'Gris', hex: '#64748B', border: '#475569' },
  'gray': { id: 'GRIS', name: 'Gris', hex: '#64748B', border: '#475569' },

  'blanco': { id: 'BLANCO', name: 'Blanco', hex: '#F8FAFC', border: '#CBD5E1' },
  'white': { id: 'BLANCO', name: 'Blanco', hex: '#F8FAFC', border: '#CBD5E1' },

  'cromado': { id: 'CROMADO', name: 'Cromado', hex: '#CBD5E1', border: '#94A3B8' },
  'cromo': { id: 'CROMADO', name: 'Cromado', hex: '#CBD5E1', border: '#94A3B8' },

  'beige': { id: 'BEIGE', name: 'Beige', hex: '#F5F5DC', border: '#D4D4AA' }
};

/**
 * Normaliza cualquier formato de color (string, objeto, JSON string) a un objeto estándar:
 * { id: string, name: string, hex: string, border: string }
 */
export function normalizeColor(c) {
  if (!c) return null;

  // Si ya es un objeto completo y válido con name y hex
  if (typeof c === 'object' && c.name && c.hex) {
    return {
      id: c.id || c.name.slice(0, 3).toUpperCase(),
      name: c.name,
      hex: c.hex,
      border: c.border || c.hex
    };
  }

  // Si es un objeto pero le falta hex o name
  if (typeof c === 'object') {
    const candidateName = c.name || c.id || '';
    const std = STANDARD_COLORS[candidateName.toLowerCase().trim()];
    if (std) {
      return { ...std, id: c.id || std.id };
    }
    return {
      id: c.id || 'COL',
      name: c.name || c.id || 'Color',
      hex: c.hex || '#10B4C1',
      border: c.border || c.hex || '#0E9AA5'
    };
  }

  // Si es un string
  if (typeof c === 'string') {
    const trimmed = c.trim();
    // Intenta parsear si es JSON string
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeColor(parsed);
      } catch {
        // continúa
      }
    }

    const lower = trimmed.toLowerCase();
    if (STANDARD_COLORS[lower]) {
      return { ...STANDARD_COLORS[lower] };
    }

    // Si es un color hex como #FF6B00
    if (trimmed.startsWith('#')) {
      return {
        id: trimmed.toUpperCase(),
        name: trimmed,
        hex: trimmed,
        border: trimmed
      };
    }

    // Default
    return {
      id: trimmed.slice(0, 3).toUpperCase(),
      name: trimmed,
      hex: '#10B4C1',
      border: '#0E9AA5'
    };
  }

  return null;
}

