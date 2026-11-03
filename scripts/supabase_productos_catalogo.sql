-- =============================================================================
-- CatalogoTyn: Tabla Oficial de Productos y Storage Centralizados en Supabase
-- Tabla: public.productos_catalogo
-- Storage Bucket: catalog-media (Imágenes WebP y PDFs de Fichas Técnicas)
-- Engine: PostgreSQL 15+ / 17+ (Supabase Project: xvrnssesbkzxeusubzes)
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =============================================================================
-- 1. TABLA PRINCIPAL DE PRODUCTOS
-- =============================================================================
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

-- Índices de aceleración
CREATE INDEX IF NOT EXISTS idx_productos_catalogo_code ON public.productos_catalogo(code);
CREATE INDEX IF NOT EXISTS idx_productos_catalogo_cat ON public.productos_catalogo(cat);
CREATE INDEX IF NOT EXISTS idx_productos_catalogo_active ON public.productos_catalogo(is_active);

-- Trigger para updated_at automático
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

-- Permisos DCL y RLS para la tabla
ALTER TABLE public.productos_catalogo ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.productos_catalogo TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Permitir lectura publica de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir insercion de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir actualizacion de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir eliminacion de productos" ON public.productos_catalogo;
DROP POLICY IF EXISTS "Permitir todo a service_role" ON public.productos_catalogo;

CREATE POLICY "Permitir lectura publica de productos" ON public.productos_catalogo FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Permitir insercion de productos" ON public.productos_catalogo FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Permitir actualizacion de productos" ON public.productos_catalogo FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Permitir eliminacion de productos" ON public.productos_catalogo FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Permitir todo a service_role" ON public.productos_catalogo FOR ALL TO service_role USING (true) WITH CHECK (true);

-- =============================================================================
-- 2. BUCKET DE SUPABASE STORAGE PARA ARCHIVOS (IMÁGENES Y PDFS)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'catalog-media',
    'catalog-media',
    true,
    52428800, -- Límite de 50 MB por archivo
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'];

-- Políticas de Acceso en storage.objects
DROP POLICY IF EXISTS "Permitir lectura publica de catalog-media" ON storage.objects;
DROP POLICY IF EXISTS "Permitir subida a catalog-media" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizacion en catalog-media" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminacion en catalog-media" ON storage.objects;

CREATE POLICY "Permitir lectura publica de catalog-media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'catalog-media');

CREATE POLICY "Permitir subida a catalog-media"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'catalog-media');

CREATE POLICY "Permitir actualizacion en catalog-media"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'catalog-media')
WITH CHECK (bucket_id = 'catalog-media');

CREATE POLICY "Permitir eliminacion en catalog-media"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'catalog-media');

COMMIT;
