-- =============================================================================
-- CatalogoTyn: Hardened Row Level Security (RLS) Policy for Supabase
-- Target Table: public.prospectos_comerciales
-- Engine: PostgreSQL 15+ / 17+ (Supabase Project: xvrnssesbkzxeusubzes)
-- Defense Standards: OWASP Top 10 (A01: Broken Access Control, A02: Cryptographic Failures)
-- Reference: Supabase Postgres Security Best Practices (security-rls-basics.md, security-privileges.md)
-- =============================================================================

BEGIN;

-- 1. Asegurar extensiones para UUID si son requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Habilitar obligatoriamente Row Level Security (RLS)
ALTER TABLE public.prospectos_comerciales ENABLE ROW LEVEL SECURITY;

-- 3. Aplicar Principio de Menor Privilegio (Defense-in-Depth a nivel de Grants SQL)
-- Revocar accesos por defecto que pudieran permitir SELECT/UPDATE/DELETE no autorizados
REVOKE ALL ON TABLE public.prospectos_comerciales FROM anon;
REVOKE ALL ON TABLE public.prospectos_comerciales FROM authenticated;

-- Otorgar únicamente privilegios mínimos requeridos
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT INSERT ON TABLE public.prospectos_comerciales TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.prospectos_comerciales TO authenticated;
GRANT ALL PRIVILEGES ON TABLE public.prospectos_comerciales TO service_role;

-- 4. Limpieza preventiva de políticas previas o permisivas
DROP POLICY IF EXISTS "Permitir insercion anonima" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir todo" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Allow anon read" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir lectura a anon" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Public leads insert" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Public leads read" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "anon_insert_only" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "authenticated_select_admin" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir solo insercion de prospectos anonima" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir lectura solo a administradores autenticados" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir gestion completa a administradores autenticados" ON public.prospectos_comerciales;
DROP POLICY IF EXISTS "Permitir acceso total a service_role" ON public.prospectos_comerciales;

-- 5. POLÍTICA 1: Inserción Anónima Estricta (Kiosco / PWA)
-- Permite únicamente INSERT al rol 'anon'. La ausencia de política SELECT impide
-- que cualquier atacante con la clave anónima lea prospectos de la base de datos.
CREATE POLICY "Permitir solo insercion de prospectos anonima"
ON public.prospectos_comerciales
FOR INSERT
TO anon
WITH CHECK (true);

-- 6. POLÍTICA 2: Lectura Exclusiva para Personal Autenticado (Asesores / Admin)
CREATE POLICY "Permitir lectura solo a administradores autenticados"
ON public.prospectos_comerciales
FOR SELECT
TO authenticated
USING (true);

-- 7. POLÍTICA 3: Modificación y Eliminación Exclusiva para Personal Autenticado
CREATE POLICY "Permitir gestion completa a administradores autenticados"
ON public.prospectos_comerciales
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 8. POLÍTICA 4: Acceso Irrestricto para Service Role (CLI, Pipelines y Migraciones)
CREATE POLICY "Permitir acceso total a service_role"
ON public.prospectos_comerciales
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMIT;
