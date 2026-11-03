-- =============================================================================
-- CatalogoTyn: Tabla Oficial de Productos Centralizados en Supabase
-- Tabla: public.productos_catalogo
-- Engine: PostgreSQL 15+ / 17+ (Supabase Project: xvrnssesbkzxeusubzes)
-- Propósito: Sincronización en la nube de productos creados/editados por el Admin
-- =============================================================================

BEGIN;

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Creación de la tabla de productos centralizada
CREATE TABLE IF NOT EXISTS public.productos_catalogo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    marca TEXT DEFAULT 'Tynor',
    linea TEXT DEFAULT 'Ortopédica',
    cat TEXT NOT NULL DEFAULT 'inmovilizador',
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_by_size JSONB DEFAULT NULL,
    stock INTEGER DEFAULT 10,
    body_part TEXT DEFAULT 'rodilla',
    badge TEXT DEFAULT 'Nuevo',
    sizes TEXT[] DEFAULT ARRAY['Universal'],
    colors TEXT[] DEFAULT ARRAY[]::TEXT[],
    has_pdf BOOLEAN DEFAULT false,
    custom_pdf_url TEXT DEFAULT NULL,
    short_desc TEXT DEFAULT '',
    desc_text TEXT DEFAULT '',
    uses TEXT[] DEFAULT ARRAY['Soporte ortopédico'],
    features TEXT[] DEFAULT ARRAY['Diseño anatómico'],
    custom_image TEXT DEFAULT NULL,
    is_custom BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Índices de aceleración de consultas
CREATE INDEX IF NOT EXISTS idx_productos_catalogo_code ON public.productos_catalogo(code);
CREATE INDEX IF NOT EXISTS idx_productos_catalogo_cat ON public.productos_catalogo(cat);
CREATE INDEX IF NOT EXISTS idx_productos_catalogo_body_part ON public.productos_catalogo(body_part);
CREATE INDEX IF NOT EXISTS idx_productos_catalogo_active ON public.productos_catalogo(is_active);

-- 4. Trigger para auto-actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_productos_catalogo_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_productos_catalogo_updated_at ON public.productos_catalogo;
CREATE TRIGGER trigger_productos_catalogo_updated_at
    BEFORE UPDATE ON public.productos_catalogo
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_productos_catalogo_updated_at();

-- 5. Habilitar Row Level Security (RLS)
ALTER TABLE public.productos_catalogo ENABLE ROW LEVEL SECURITY;

-- 6. Configurar permisos DCL
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.productos_catalogo TO anon, authenticated, service_role;

-- 7. Limpieza de políticas previas
DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir insercion de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir actualizacion de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir eliminacion de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir todo a service_role" ON public.productos_catalogo;

-- 8. Políticas RLS
-- Lectura pública: Todos los quioscos y clientes pueden ver los productos activos
CREATE POLICY "Permitir lectura publica de productos"
ON public.productos_catalogo
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Inserción: Permitir registrar nuevos productos
CREATE POLICY "Permitir insercion de productos"
ON public.productos_catalogo
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Actualización: Permitir modificar productos existentes
CREATE POLICY "Permitir actualizacion de productos"
ON public.productos_catalogo
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Eliminación: Permitir eliminar o deshabilitar productos
CREATE POLICY "Permitir eliminacion de productos"
ON public.productos_catalogo
FOR DELETE
TO anon, authenticated
USING (true);

-- Acceso irrestricto para administradores de base de datos
CREATE POLICY "Permitir todo a service_role"
ON public.productos_catalogo
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMIT;
