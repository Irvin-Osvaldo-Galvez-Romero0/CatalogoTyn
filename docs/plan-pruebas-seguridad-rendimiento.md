# Plan Maestro de Pruebas de Seguridad y Rendimiento
## CatalogoTyn — Kiosco Interactivo de Ortopedia y Rehabilitación

---

### Control de Versiones y Aprobaciones

| Versión | Fecha | Autor / Rol | Descripción de Cambios | Estado |
| :---: | :---: | :--- | :--- | :---: |
| **1.0** | 2026-11-05 | **Equipo de Ingeniería de Calidad & Ciberseguridad** | Emisión inicial exhaustiva del Plan Maestro unificado de Pruebas de Seguridad (OWASP / WSTG), Rendimiento (Core Web Vitals), PWA (Workbox), Resiliencia Offline y Protocolos RoE para Producción. | **Aprobado** |

* **Alcance del Sistema:** Aplicación Web Kiosco, PWA Offline-First (Workbox), Backend Supabase PostgreSQL & PostgREST (`xvrnssesbkzxeusubzes.supabase.co`), Supabase Storage (`catalog-media`), Red de Entrega de Medios Cloudflare R2 (`media.tynorcatalog.com`), Edge Functions Serverless en Vercel (`catalogotyn.vercel.app` / `/api/send-email.js`).
* **Público Objetivo:** Ingenieros de Software, Especialistas en Aseguramiento de Calidad (QA), Auditores de Ciberseguridad (AppSec), DevOps y Administradores de Infraestructura Médica.
* **Clasificación del Documento:** Confidencial / Uso Técnico Interno — Tynor México.

---

## Índice General

1. [Resumen Ejecutivo y Arquitectura de Pruebas](#1-resumen-ejecutivo-y-arquitectura-de-pruebas)
   - 1.1 Contexto y Criticidad Operativa
   - 1.2 Topología Arquitectónica y Superficie de Exposición
   - 1.3 Modelo de Amenazas (Threat Modeling)
   - 1.4 Supuestos, Dependencias y Restricciones
2. [Plan Maestro de Pruebas de Seguridad](#2-plan-maestro-de-pruebas-de-seguridad)
   - 2.1 Metodología de Auditoría (OWASP Top 10:2021 & WSTG v4.2)
   - 2.2 Herramientas y Pipeline de Pruebas SAST y DAST
   - 2.3 Matriz de Casos de Prueba de Seguridad
     - *SEC-CONF: Configuración, CSP y Cabeceras HTTP*
     - *SEC-INJ: Prevención de Inyecciones y Manipulación de Documentos*
     - *SEC-DATA: Auditoría de Base de Datos y Supabase Row Level Security (RLS)*
     - *SEC-AUTH: Autenticación Administrativa por NIP y Criptografía*
     - *SEC-API: Seguridad en Endpoints Serverless y Enrutamiento SMTP*
3. [Protocolos de Seguridad Operativa y Salvaguardas en Producción (RoE)](#3-protocolos-de-seguridad-operativa-y-salvaguardas-en-producción-roe)
   - 3.1 Principio de Inocuidad y Cargas No Destructivas
   - 3.2 Ventana Operativa de Bajo Tráfico
   - 3.3 Taxonomía de Trazabilidad y Cabeceras de Auditoría
   - 3.4 Limitadores de Tasa y Concurrencia en Vivo
   - 3.5 Procedimiento Automatizado de Reversión y Limpieza (Rollback)
   - 3.6 Interruptor de Parada de Emergencia (Emergency Kill-Switch)
4. [Plan Maestro de Pruebas de Rendimiento y PWA](#4-plan-maestro-de-pruebas-de-rendimiento-y-pwa)
   - 4.1 Métricas Clave y Umbrales Cuantitativos de Core Web Vitals
   - 4.2 Matriz de Casos de Prueba de Rendimiento
     - *PERF-CWV: Core Web Vitals y Rendimiento del Hilo Principal*
     - *PERF-BND: Presupuesto de Bundles, Code-Splitting y Optimización de Assets*
     - *PERF-PWA: Service Worker Workbox, Caching y Resiliencia Offline*
     - *PERF-STR: Pruebas de Estrés, Concurrencia y Resistencia de Cuotas*
   - 4.3 Especificación de Perfiles de Carga y Scripts k6
5. [Rúbricas de Evaluación y Criterios de Aceptación](#5-rúbricas-de-evaluación-y-criterios-de-aceptación)
   - 5.1 Definición de Estados de Dictamen
   - 5.2 Rúbrica Detallada por Dominio Tecnológico
   - 5.3 Criterios de Aprobación Global para Pase a Producción
6. [Cronograma, Herramientas y Matriz RACI](#6-cronograma-herramientas-y-matriz-raci)
   - 6.1 Catálogo Unificado de Herramientas de Prueba
   - 6.2 Fases y Cronograma de Ejecución
   - 6.3 Matriz de Asignación de Responsabilidades (RACI)

---

## 1. Resumen Ejecutivo y Arquitectura de Pruebas

### 1.1 Contexto y Criticidad Operativa

**CatalogoTyn** es una solución digital de exhibición interactiva y gestión comercial desarrollada para **Tynor México**. Su propósito es funcionar como un kiosco digital de alta disponibilidad desplegado en eventos médicos, congresos ortopédicos, salas de exhibición hospitalarias y dispositivos táctiles en puntos de venta.

El sistema permite a médicos, fisioterapeutas, distribuidores y pacientes:
1. Navegar un catálogo interactivo de más de 180 dispositivos médicos ortopédicos clasificados por regiones anatómicas y patologías.
2. Interactuar con un visor tridimensional anatómico (`<model-viewer>`) que mapea productos directamente sobre el sistema musculoesquelético humano.
3. Generar cotizaciones formales instantáneas en PDF mediante síntesis dinámica del lado del cliente (`jsPDF` / `jspdf-autotable`), transmitibles vía código QR bidimensional o despachables directamente a cuentas de correo electrónico corporativas a través de una función serverless (`api/send-email.js`).
4. Capturar prospectos comerciales (leads) en tiempo real con persistencia en la base de datos PostgreSQL de **Supabase** y almacenamiento intermedio en cola local resiliente ante fallas de conectividad.
5. Gestionar la personalización visual (branding, paletas de color y logotipos institucionales) y productos personalizados mediante una consola de administración protegida por Número de Identificación Personal (NIP).

Dado que el kiosco opera en hardware desatendido accesible al público general y a menudo bajo redes inalámbricas congestionadas o intermitentes, la aplicación enfrenta desafíos simultáneos de **seguridad física y lógica** (riesgo de manipulación local, inyección de datos, robo masivo de prospectos comerciales) y de **rendimiento extremo** (necesidad de fluidez a 60 FPS en visualización 3D, tiempos de carga casi instantáneos y funcionamiento ininterrumpido sin conexión a internet).

---

### 1.2 Topología Arquitectónica y Superficie de Exposición

La infraestructura de CatalogoTyn se organiza en tres capas lógicas interconectadas:

```mermaid
flowchart TD
    subgraph Client ["Capa de Cliente: Kiosco PWA / Web Móvil"]
        UI["React 18 UI (Vite)<br/>CatalogView, AnatomyView 3D, Modals"]
        SW["Workbox Service Worker<br/>CacheFirst (Assets/3D) / NetworkFirst"]
        LocalStorage["Almacenamiento Local (5 MB)<br/>Cola Offline Leads, Hash NIP, Config SMTP"]
        WebCrypto["Web Crypto API<br/>SHA-256 + Salt Client Check"]
        PDFGen["jsPDF Engine<br/>Síntesis de Cotización en Memoria"]
    end

    subgraph Edge ["Capa de Borde & CDN: Vercel & Cloudflare"]
        VercelCDN["Vercel Edge Network<br/>HSTS, CSP, XFO, Compresión Brotli/Gzip"]
        MediaCDN["Cloudflare R2 Media CDN<br/>media.tynorcatalog.com (Imágenes WebP / PDFs)"]
        VercelFn["Serverless Function (/api/send-email.js)<br/>CORS Whitelist, CRLF Filter, Nodemailer Relay"]
    end

    subgraph Backend ["Capa de Persistencia & Servicios Externos"]
        SupabasePostgREST["Supabase PostgREST API (xvrnssesbkzxeusubzes)<br/>Roles: anon / service_role"]
        SupabaseDB[("PostgreSQL Database<br/>- prospectos_comerciales<br/>- productos_catalogo<br/>- configuracion_kiosco")]
        SupabaseStorage["Supabase Storage Engine<br/>Bucket: catalog-media"]
        CorporateSMTP["Servidores de Correo Corporativo<br/>SMTP TLS 1.2 / IMAP Sent Sync"]
    end

    UI <-->|Gestión de Caché / Offline Shell| SW
    UI <-->|Persistencia Síncrona| LocalStorage
    UI -->|Validación Criptográfica| WebCrypto
    UI -->|Renderizado Documentos| PDFGen
    UI -->|Peticiones HTTPS Estáticos| VercelCDN
    UI -->|Descarga Activos Pesados| MediaCDN
    UI -->|REST Peticiones con Supabase Anon Key| SupabasePostgREST
    SupabasePostgREST <--> SupabaseDB
    UI -->|Subida Binarios WebP/PDF| SupabaseStorage
    UI -->|POST Payload Cotización| VercelFn
    VercelFn -->|SMTP Port 465/587| CorporateSMTP
    VercelFn -.->|IMAP Port 993 (tls: unverified)| CorporateSMTP
```

---

### 1.3 Modelo de Amenazas (Threat Modeling)

Aplicando el marco de modelado de amenazas **STRIDE** sobre los componentes del sistema, se identifican los siguientes vectores primarios:

| Vector STRIDE | Componente Afectado | Escenario de Ataque Identificado | Impacto Técnico / Comercial | Severidad |
| :--- | :--- | :--- | :--- | :---: |
| **Spoofing** (Suplantación) | `AdminAuthModal.jsx` | Ataque de diccionario o fuerza bruta sobre el NIP de 4 dígitos (espacio de 10,000 combinaciones) debido a verificación puramente en el cliente y salt estático. | Acceso no autorizado a consola de administración del kiosco. | **Alta** |
| **Tampering** (Alteración) | Supabase `productos_catalogo` & `configuracion_kiosco` | Envío de peticiones HTTP `PATCH` o `DELETE` directas a PostgREST con la clave pública `anon` omitiendo la validación NIP del frontend. | Modificación no autorizada de precios, nombres o defacement de la identidad corporativa. | **Crítica** |
| **Information Disclosure** (Fuga de Información) | Supabase `prospectos_comerciales` | Ejecución de consultas `GET /rest/v1/prospectos_comerciales?select=*` utilizando la clave pública `anon` expuesta en el código compilado. | Exfiltración masiva de datos personales y comerciales de médicos y clientes (PII). | **Crítica** |
| **Information Disclosure** | `localStorage` / Bundles JS | Extracción de contraseñas de cuentas de correo corporativo almacenadas en texto plano en `localStorage['tynor_email_gateway_config']`. | Compromiso de credenciales de buzones SMTP institucionales. | **Alta** |
| **Denial of Service** (DoS) | `src/services/pdfGenerator.js` & `PdfViewer.jsx` | Inyección de carritos con cientos de productos o carga de PDFs técnicos masivos que fuerzan la instanciación de cientos de `<canvas>` sin virtualización. | Bloqueo del hilo principal de JavaScript, consumo desmedido de memoria GPU y cuelgue del navegador del kiosco. | **Media-Alta** |
| **Elevation of Privilege** (Elevación de Privilegios) | Servidor Serverless `api/send-email.js` | Aprovechamiento del endpoint serverless para actuar como Open Relay SMTP o enviar solicitudes a recursos internos (SSRF). | Emisión de spam con reputación del dominio corporativo o escaneo de red interna de la nube. | **Alta** |

---

### 1.4 Supuestos, Dependencias y Restricciones

1. **Restricción de Recursos en Supabase (Free Tier):** El proyecto opera bajo una instancia gratuita en Supabase (`xvrnssesbkzxeusubzes`), lo que impone un límite estricto de 60 conexiones concurrentes directas a PostgreSQL, un límite de ancho de banda mensual de 2 GB de egress y un tamaño de base de datos de 500 MB. Las pruebas de carga deben respetar estas cotas para evitar la suspensión del servicio.
2. **Restricción de Concurrencia en Vercel (Hobby Tier):** Las funciones serverless poseen un tiempo máximo de ejecución de 10 segundos y un techo de 100 ejecuciones simultáneas globales. Tiempos de conexión prolongados a servidores SMTP externos pueden generar errores HTTP 504 (Gateway Timeout).
3. **Persistencia del Lado del Cliente:** El uso actual de `localStorage` para almacenar productos personalizados y prospectos en cola tiene un límite físico impuesto por el motor del navegador de **5 MB**. La inserción de imágenes en Base64 puede provocar excepciones no controladas de `QuotaExceededError`.
4. **Presupuesto de Red en Eventos Médicos:** Los recintos feriales presentan latencias elevadas (200 ms - 800 ms) y pérdida de paquetes. La PWA debe funcionar de manera 100% autónoma en modo desconectado.

---

## 2. Plan Maestro de Pruebas de Seguridad

### 2.1 Metodología de Auditoría (OWASP Top 10:2021 & WSTG v4.2)

La evaluación de seguridad sigue una metodología híbrida rigurosa compuesta por:
* **SAST (Static Application Security Testing):** Análisis estático de código fuente, detección de secretos en repositorios y auditoría de vulnerabilidades en el árbol de dependencias (`package-lock.json`).
* **DAST (Dynamic Application Security Testing):** Pruebas dinámicas de caja negra y caja gris sobre el entorno en ejecución, verificando el comportamiento de las cabeceras HTTP, políticas de aislamiento, endpoints de API y mecanismos de autorización en base de datos.
* **Mapeo Normativo:** Cada caso de prueba está formalmente referenciado contra las categorías del **OWASP Top 10:2021** y las guías de prueba del **OWASP Web Security Testing Guide (WSTG v4.2)**.

---

### 2.2 Herramientas y Pipeline de Pruebas SAST y DAST

Para garantizar reproducibilidad y automatización en el ciclo de vida del proyecto, se definen las siguientes herramientas y comandos de ejecución:

| Tipo | Herramienta | Versión Mínima | Propósito Operativo | Comando de Ejecución Estándar |
| :--- | :--- | :---: | :--- | :--- |
| **SAST** | `npm audit` | Integrada en Node.js | Auditoría de vulnerabilidades en dependencias NPM. | `npm audit --json` / `npm audit fix` |
| **SAST** | `Semgrep OSS` | $\ge 1.60.0$ | Detección de patrones inseguros, fugas de secretos y uso de APIs riesgosas en React. | `semgrep --config p/react --config p/secrets --config p/owasp-top-ten src/` |
| **SAST** | `ESLint Security` | $\ge 3.0.0$ | Reglas de linting orientadas a seguridad (`eslint-plugin-security`). | `npx eslint --plugin security --rule 'security/detect-object-injection: warn' src/` |
| **SAST** | `Trivy` | $\ge 0.50.0$ | Detección de secretos duros, credenciales y licencias en el sistema de archivos. | `trivy fs --security-checks config,secret,vuln .` |
| **DAST** | `OWASP ZAP` | $\ge 2.14.0$ | Escaneo dinámico de vulnerabilidades web (Passive & Active Scan). | `zap-baseline.py -t https://catalogotyn.vercel.app -r zap-report.html` |
| **DAST** | `cURL` / `OpenSSL` | Sistema | Pruebas de cabeceras HTTP, sondas REST PostgREST y verificación TLS. | `curl -s -I https://catalogotyn.vercel.app` |
| **DAST** | `Playwright` | $\ge 1.40.0$ | Automatización de pruebas de inyección en UI, desbordamiento de memoria y NIP brute-force. | `npx playwright test tests/security/` |

---

### 2.3 Matriz de Casos de Prueba de Seguridad

A continuación se detallan las especificaciones técnicas exhaustivas de los casos de prueba de seguridad bajo el esquema normalizado `SEC-[CATEGORIA]-[NUMERO]`.

---

#### SEC-CONF: Configuración, CSP y Cabeceras HTTP

### SEC-CONF-001: Verificación y Endurecimiento de la Política de Seguridad de Contenido (CSP)
- **Vector / Categoría OWASP:** A05:2021 – Security Misconfiguration | WSTG-CONF-01 (Testing Network Infrastructure Configuration)
- **Objetivo:** Comprobar que la cabecera `Content-Security-Policy` no contenga directivas permisivas innecesarias (`unsafe-inline`, `unsafe-eval`, `https://unpkg.com`) y verificar la inclusión de la directiva CSP mediante etiqueta `<meta>` para entornos empaquetados móviles (Android Capacitor / Electron).
- **Severidad:** Media-Alta
- **Herramientas:** `cURL`, Google Chrome DevTools (Security Panel / Console), OWASP ZAP.
- **Precondiciones:** Aplicación desplegada en Vercel Edge (`https://catalogotyn.vercel.app`) y compilación local en `dist/`.
- **Pasos de Ejecución:**
  1. Ejecutar una solicitud HTTP HEAD al dominio de producción:
     ```powershell
     curl.exe -s -I "https://catalogotyn.vercel.app" | Select-String -Pattern "Content-Security-Policy"
     ```
  2. Analizar el valor de `script-src` en la respuesta:
     - Comprobar la presencia de `https://unpkg.com`.
     - Comprobar la presencia de `'unsafe-eval'`.
  3. Ejecutar una búsqueda estática en el código fuente para determinar si `unpkg.com` es requerido legítimamente:
     ```powershell
     Get-ChildItem -Path src -Recurse | Select-String -Pattern "unpkg.com"
     ```
  4. Inspeccionar `dist/index.html` para verificar si existe una etiqueta `<meta http-equiv="Content-Security-Policy" ...>` que proteja la PWA al ejecutarse desde esquemas locales `file://` o `capacitor://`.
  5. En la consola del navegador, intentar inyectar un script externo de un dominio no listado:
     ```javascript
     const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.0/axios.min.js'; document.head.appendChild(s);
     ```
- **Resultado Esperado:**
  - El navegador bloquea la carga de scripts no autorizados reportando una violación de CSP.
  - La directiva `script-src` elimina `https://unpkg.com` y `'unsafe-eval'`.
  - Existe `<meta http-equiv="Content-Security-Policy">` en `index.html` para entornos empaquetados.

### SEC-CONF-002: Verificación Exhaustiva de Cabeceras HTTP de Seguridad
- **Vector / Categoría OWASP:** A05:2021 – Security Misconfiguration | WSTG-CONF-07 (Testing HTTP Strict Transport Security & Clickjacking)
- **Objetivo:** Validar la presencia, sintaxis y robustez de las cabeceras defensivas HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy y Permissions-Policy en todas las respuestas del servidor.
- **Severidad:** Alta
- **Herramientas:** `cURL`, SecurityHeaders.com scanner.
- **Precondiciones:** Aplicación accesible vía HTTPS en Vercel.
- **Pasos de Ejecución:**
  1. Obtener todas las cabeceras de respuesta HTTP del dominio principal (en Windows PowerShell, utilizar `-o NUL` o `-I`, ya que `$null` es interpretado como parámetro vacío provocando error en cURL):
     ```powershell
     # Alternativa 1: Volcado de cabeceras descartando cuerpo en Windows
     curl.exe -s -D - "https://catalogotyn.vercel.app" -o NUL
     
     # Alternativa 2: Petición HEAD directa
     curl.exe -s -I "https://catalogotyn.vercel.app"
     ```
  2. Verificar los siguientes valores exactos:
     - `Strict-Transport-Security`: Debe contener `max-age=63072000; includeSubDomains; preload`.
     - `X-Frame-Options`: Debe ser estrictamente `DENY` para evitar ataques de Clickjacking en pantallas de kiosco.
     - `X-Content-Type-Options`: Debe ser `nosniff` para evitar ataques de MIME-Confusion en assets WebP o GLB.
     - `Referrer-Policy`: Debe ser `strict-origin-when-cross-origin`.
     - `Permissions-Policy`: Debe restringir micrófono (`microphone=()`), geolocalización (`geolocation=()`) y acotar la cámara a orígenes locales (`camera=(self)`).
  3. Crear una página HTML local con un `<iframe>` apuntando a `https://catalogotyn.vercel.app` e intentar renderizarla en el navegador.
- **Resultado Esperado:**
  - Todas las cabeceras se devuelven conforme a la especificación.
  - El navegador rechaza renderizar la página dentro del `<iframe>`, emitiendo en consola: `Refused to display 'https://catalogotyn.vercel.app/' in a frame because it set 'X-Frame-Options' to 'DENY'`.

### SEC-CONF-003: Auditoría de Exposición de Secretos y Tokens en Bundles Frontend
- **Vector / Categoría OWASP:** A01:2021 – Broken Access Control & A07:2021 – Identification and Authentication Failures | WSTG-INFO-05 (Review Webpage Content for Information Leakage)
- **Objetivo:** Detectar la presencia involuntaria de tokens privados de Vercel, claves de servicio de Supabase (`service_role`), credenciales SMTP maestras o secretos de infraestructura dentro del repositorio y en los archivos compilados en `dist/assets/`.
- **Severidad:** Crítica
- **Herramientas:** `Trivy`, `grep` / PowerShell regex, `git log`.
- **Precondiciones:** Repositorio clonado y build de producción generado (`npm run build`).
- **Pasos de Ejecución:**
  1. Ejecutar análisis de secretos con Trivy sobre la raíz del proyecto:
     ```powershell
     trivy fs --security-checks secret .
     ```
  2. Ejecutar un escaneo por expresiones regulares en todos los archivos empaquetados en `dist/`:
     ```powershell
     Get-ChildItem -Path dist/assets/*.js | Select-String -Pattern "(?i)(service_role|smtp_pass|vercel_token|private_key|aws_secret)"
     ```
  3. Verificar que el archivo `.gitignore` contenga exclusiones estrictas para `.env`, `.env.local`, `.env.*.local`, archivos `.pem` y directorios temporales de agentes.
  4. Revisar el historial de Git para descartar que claves privadas hayan sido confirmadas en commits anteriores:
     ```powershell
     git log -p -S "VERCEL_OIDC_TOKEN"
     ```
- **Resultado Esperado:**
  - Cero coincidencias de credenciales de alto privilegio o claves privadas.
  - La única clave de Supabase presente en el bundle compilado es la clave pública `anon` (`SUPABASE_ANON_KEY`), cuyo alcance debe estar limitado por RLS en base de datos.

### SEC-CONF-004: Auditoría de Almacenamiento en Texto Plano de Credenciales SMTP en LocalStorage
- **Vector / Categoría OWASP:** A02:2021 – Cryptographic Failures & A04:2021 – Insecure Design | WSTG-CLNT-12 (Testing for Browser Storage)
- **Objetivo:** Auditar la persistencia de configuraciones de pasarela de correo en `localStorage` (`tynor_email_gateway_config`) y verificar que contraseñas corporativas no se almacenen en texto plano accesible por scripts en el navegador.
- **Severidad:** Alta
- **Herramientas:** Navegador DevTools (Application Tab -> Local Storage), script de prueba automatizado.
- **Precondiciones:** Kiosco configurado con pasarela de correo personalizada desde la consola administrativa.
- **Pasos de Ejecución:**
  1. Abrir la consola administrativa del kiosco, acceder a la configuración de pasarela SMTP y guardar credenciales de prueba (`host: smtp.tynor.com.mx`, `user: cotizaciones@tynor.com.mx`, `password: ClaveSecreta123`).
  2. Ejecutar la inspección del almacenamiento local mediante JavaScript:
     ```javascript
     const config = JSON.parse(localStorage.getItem('tynor_email_gateway_config') || '{}');
     console.log('Password expuesta:', config.password);
     ```
  3. Evaluar el riesgo de extracción por extensiones maliciosas, usuarios físicos con acceso a F12 en el kiosco o vulnerabilidades XSS secundarias.
- **Resultado Esperado:**
  - La arquitectura defensiva debe desacoplar el almacenamiento de contraseñas SMTP del cliente, delegando la autenticación al backend serverless mediante variables de entorno privadas (`process.env.SMTP_PASSWORD`), o almacenando únicamente tokens efímeros cifrados.

---

#### SEC-INJ: Prevención de Inyecciones y Manipulación de Documentos

### SEC-INJ-001: Auditoría de Inyección Cross-Site Scripting (XSS) en Catálogo y Modales
- **Vector / Categoría OWASP:** A03:2021 – Injection | WSTG-INPV-01 / WSTG-INPV-02 (Reflected & Stored XSS)
- **Objetivo:** Validar que ninguna entrada proveniente de parámetros URL, campos de búsqueda o registros de catálogo ejecute scripts maliciosos en el contexto del DOM de la aplicación.
- **Severidad:** Crítica
- **Herramientas:** Playwright, OWASP ZAP, manual DOM injection.
- **Precondiciones:** Aplicación en ejecución local o en staging.
- **Pasos de Ejecución:**
  1. Inyectar payloads políglotas en el campo de búsqueda de productos:
     - Payload 1: `"><script>/*TEST-AUDIT*/console.error(1)</script>`
     - Payload 2: `"><img src=x onerror=console.error('XSS-PROBE')>`
     - Payload 3: `javascript:console.error(document.domain)`
  2. Verificar que los componentes `CatalogView.jsx` y `ProductDetailModal.jsx` rendericen los términos como texto plano escapado dentro del JSX (`{p.name}`, `{query}`).
  3. Confirmar que no exista uso de `dangerouslySetInnerHTML`, `innerHTML` ni manipulaciones manuales del DOM con `eval()` en todo el árbol de componentes.
- **Resultado Esperado:**
  - Los payloads se muestran de forma literal y textual en pantalla sin ejecución de JavaScript.
  - La consola del navegador permanece limpia de alertas o ejecuciones no autorizadas.

### SEC-INJ-002: Inyección y Des-serialización Insegura en Parámetros URL (?q=)
- **Vector / Categoría OWASP:** A08:2021 – Software and Data Integrity Failures | WSTG-INPV-11 (Testing for Code Injection)
- **Objetivo:** Comprobar la resiliencia del deserializador base64 de parámetros de cotización compartida en `src/App.jsx:37-58` frente a entradas maliciosas, cadenas binarias corruptas y objetos de tamaño excesivo.
- **Severidad:** Alta
- **Herramientas:** `node`, navegador web.
- **Precondiciones:** Aplicación iniciada.
- **Pasos de Ejecución:**
  1. Generar cargas de prueba para el parámetro `?q=`:
     - Prueba A (JSON corrupto): `?q=YWJjZGVmZ2hpams=` (Base64 de "abcdefghijk")
     - Prueba B (Payload recursivo / circular DoS): Objeto JSON con anidación profunda (1,000 niveles).
     - Prueba C (XSS embebido en objeto): JSON con estructura `[{"code":"101","name":"<img src=x onerror=alert(1)>","qty":1}]` convertido a Base64.
  2. Cargar en el navegador la URL construida:
     `https://catalogotyn.vercel.app/?q=<PAYLOAD_BASE64>`
  3. Observar la consola de errores y el comportamiento de la interfaz gráfica.
- **Resultado Esperado:**
  - El bloque `try/catch` en `App.jsx` captura cualquier excepción de parseo, registrando el error sin provocar pantalla blanca (White Screen of Death) ni romper el árbol de React.
  - Los datos reconstruidos se tratan estrictamente como cadenas de texto en los componentes visuales.

### SEC-INJ-003: Prevención de Denegación de Servicio (DoS) en Generación de Cotizaciones PDF
- **Vector / Categoría OWASP:** A04:2021 – Insecure Design | WSTG-INPV-05 (Testing for Memory Allocation / DoS)
- **Objetivo:** Evaluar la resistencia de `src/services/pdfGenerator.js` y `jspdf-autotable` al sintetizar cotizaciones masivas con cientos de renglones o imágenes con dimensiones anómalas (Decompression Bombs).
- **Severidad:** Media-Alta
- **Herramientas:** Script de prueba de estrés Node.js / Playwright (`tests/stress_resilience_report.json`).
- **Precondiciones:** Kiosco abierto en el modal de cotización.
- **Pasos de Ejecución:**
  1. Inyectar en el estado del carrito un arreglo artificial de 500 productos únicos con nombres extensos y precios numéricos válidos.
  2. Disparar la generación del documento mediante `createQuotePdf(cartItems, customerInfo, branding)`.
  3. Medir el tiempo de retención del hilo principal mediante `performance.now()`.
  4. Suministrar una URL de logotipo malicioso de dimensiones extremas (10,000 x 10,000 píxeles) para evaluar `getLogoAsDataUrl()` y el tamaño de canvas asignado.
- **Resultado Esperado:**
  - El generador limita la cantidad máxima de productos permitidos en una cotización (máximo 50 ítems).
  - La función escala el lienzo del logotipo a un tamaño acotado (máximo 500x500 px) evitando la asignación masiva de buffers gráficos en RAM.
  - La síntesis no debe exceder 2.5 segundos ni congelar de forma irreversible la interfaz de usuario.

### SEC-INJ-004: Prevención de Asignación Excesiva de Memoria Canvas en PDF.js
- **Vector / Categoría OWASP:** A04:2021 – Insecure Design | WSTG-CLNT-02 (Client-Side Resource Manipulation)
- **Objetivo:** Verificar que el componente `src/components/PdfViewer.jsx` no sature la memoria del kiosco al abrir fichas técnicas o manuales de ortopedia de alta densidad de páginas mediante la falta de virtualización de lienzos `<canvas>`.
- **Severidad:** Alta
- **Herramientas:** Chrome DevTools Memory Profiler (Heap Snapshot & Allocation Timeline).
- **Precondiciones:** Ficha técnica multipágina cargada en el visor (ej. `TynorManuales.pdf` de 80+ páginas).
- **Pasos de Ejecución:**
  1. Abrir una ficha técnica de más de 50 páginas en el modal `PdfViewer`.
  2. Monitorear en tiempo real el consumo de memoria del proceso del navegador (Task Manager y Memory Tab).
  3. Verificar si el DOM genera simultáneamente $N$ elementos `<canvas>` para todas las páginas o si utiliza una ventana de renderizado virtualizado (sólo renderiza la página visible y 1 adyacente).
  4. Realizar un desplazamiento continuo rápido (scroll agresivo) a lo largo del documento.
- **Resultado Esperado:**
  - El consumo de memoria GPU/RAM se mantiene estabilizado por debajo de 150 MB adicionales.
  - No ocurren cierres inesperados de la pestaña del navegador por agotamiento de memoria (`Out of Memory Crash`).

---

#### SEC-DATA: Auditoría de Base de Datos y Supabase Row Level Security (RLS)

### SEC-DATA-001: Auditoría de Fuga Masiva de PII en `public.prospectos_comerciales`
- **Vector / Categoría OWASP:** A01:2021 – Broken Access Control | WSTG-ATHZ-02 (Testing for Bypassing Authorization Schema)
- **Objetivo:** Validar que la tabla de prospectos comerciales de Supabase rechace de forma estricta las solicitudes de lectura (`SELECT`) emitidas con el rol público anónimo (`anon`), permitiendo únicamente la inserción a ciegas (`INSERT`) de nuevos prospectos.
- **Severidad:** Crítica
- **Herramientas:** `cURL.exe`, PowerShell.
- **Precondiciones:** Conocimiento del endpoint de Supabase y de la clave pública `SUPABASE_ANON_KEY`.
- **Pasos de Ejecución:**
  1. Ejecutar una consulta de extracción total de registros y recuento a través de la API REST de PostgREST:
     ```powershell
     $ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c"
     curl.exe -s -i -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales?select=count"
     ```
  2. Intentar solicitar campos explícitos de información personal sensible (`nombre_completo`, `nombre_empresa`, `email`, `telefono`):
     ```powershell
     curl.exe -s -i -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales?select=nombre_completo,nombre_empresa,email,telefono&limit=1"
     ```
     > **Hallazgo Crítico en Producción:** En el entorno actual sin políticas RLS endurecidas, la consulta anterior responde con `HTTP/1.1 200 OK` exponiendo registros reales con datos personales (PII) no enmascarados de prospectos. Esto evidencia empíricamente la vulnerabilidad de acceso no autorizado y la necesidad perentoria de activar RLS restrictivo.
  3. Ejecutar una inserción legítima de prueba con prefijo de auditoría (cumpliendo con la restricción `NOT NULL` en `nombre_empresa`):
     ```powershell
     curl.exe -s -i -X POST -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" -H "Content-Type: application/json" -H "Prefer: return=minimal" -d '{\"nombre_completo\":\"[TEST-AUDIT] Doctor QA\",\"nombre_empresa\":\"[TEST-AUDIT] Empresa Medica\",\"email\":\"test-audit@tynor.com.mx\",\"telefono\":\"5550001122\"}' "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales"
     ```
- **Resultado Esperado:**
  - Tras la remediación con RLS endurecido (`scripts/supabase_secure_rls.sql`), los pasos 1 y 2 DEBEN retornar un arreglo vacío `[]` (cero filas visibles) o denegación de privilegios, impidiendo la lectura de prospectos existentes a usuarios anónimos.
  - El paso 3 DEBE retornar HTTP `201 Created` confirmando que la política de inserción a ciegas (`FOR INSERT TO anon WITH CHECK (true)`) permanece operativa.

### SEC-DATA-002: Auditoría de Mutación No Autorizada en `public.productos_catalogo`
- **Vector / Categoría OWASP:** A01:2021 – Broken Access Control | WSTG-ATHZ-02 (Bypassing Authorization)
- **Objetivo:** Comprobar que clientes externos no autenticados en Supabase Auth no puedan alterar, sobreescribir o eliminar productos del catálogo maestro mediante peticiones directas a PostgREST utilizando la clave `anon`.
- **Severidad:** Crítica
- **Herramientas:** `cURL.exe`.
- **Precondiciones:** Clave `anon` de Supabase.
- **Pasos de Ejecución:**
  1. Enviar una petición HTTP `PATCH` para intentar modificar un producto existente de prueba (ej. `code=eq.[TEST-AUDIT]-PROBE` o código conocido):
     ```powershell
     $ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c"
     curl.exe -s -i -X PATCH -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" -H "Content-Type: application/json" -H "Prefer: return=representation" -d '{\"name\":\"[TEST-AUDIT] Producto Alterado\"}' "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/productos_catalogo?code=eq.NONEXISTENT_PROBE"
     ```
  2. Enviar una petición HTTP `DELETE` con la clave pública:
     ```powershell
     curl.exe -s -i -X DELETE -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/productos_catalogo?code=eq.NONEXISTENT_PROBE"
     ```
  3. Crear un registro sonda de auditoría (`[TEST-AUDIT]-PROBE`) con `service_role` y evaluar si `anon` puede sobreescribirlo o eliminarlo.
- **Resultado Esperado y Clarificación Semántica PostgREST:**
  - **Comportamiento Estándar de PostgREST:** Cuando una consulta `PATCH` o `DELETE` no encuentra filas coincidentes (`NONEXISTENT_PROBE`) y el rol posee privilegios de escritura en la tabla, PostgREST retorna `HTTP 200 OK []` (arreglo vacío) o `HTTP 204 No Content`, lo cual NO equivale a un bloqueo por RLS ni a un error 401/403.
  - **Criterio de Rechazo RLS:** 
    - En el estado actual no mitigado (políticas de `scripts/supabase_productos_catalogo.sql`), la mutación sobre filas reales tiene éxito (`200 OK` con datos mutados o `201 Created`), evidenciando vulnerabilidad crítica.
    - Con RLS endurecido (`REVOKE UPDATE, DELETE ON TABLE public.productos_catalogo FROM anon`), PostgREST debe retornar `HTTP 401/403 Forbidden` (`permission denied for table productos_catalogo`) o mutar estrictamente cero filas (`[]`), garantizando la inmutabilidad del catálogo médico.

### SEC-DATA-003: Auditoría de Alteración No Autorizada de Branding en `public.configuracion_kiosco`
- **Vector / Categoría OWASP:** A01:2021 – Broken Access Control | WSTG-ATHZ-02 (Defacement Prevention)
- **Objetivo:** Verificar que la configuración global de identidad gráfica del kiosco (colores de marca, logotipo, título) no pueda ser modificada por usuarios no autorizados a través de PostgREST.
- **Severidad:** Crítica
- **Herramientas:** `cURL.exe`.
- **Precondiciones:** Registro existente con `id=global` en `configuracion_kiosco`.
- **Pasos de Ejecución:**
  1. Consultar la configuración actual de lectura:
     ```powershell
     $ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c"
     curl.exe -s -i -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/configuracion_kiosco?select=*"
     ```
  2. Intentar mutar el color corporativo enviando una solicitud no destructiva a un registro de prueba:
     ```powershell
     curl.exe -s -i -X PATCH -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" -H "Content-Type: application/json" -H "Prefer: return=representation" -d '{\"brand_color\":\"#FF0000\"}' "https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/configuracion_kiosco?id=eq.NONEXISTENT_PROBE"
     ```
- **Resultado Esperado:**
  - La lectura pública para `id=global` debe estar permitida (`200 OK`).
  - La actualización (`PATCH`, `POST`, `DELETE`) para el rol `anon` debe ser rechazada con código HTTP `401` o `403`.

### SEC-DATA-004: Auditoría y Aprovisionamiento del Bucket `catalog-media` en Supabase Storage
- **Vector / Categoría OWASP:** A05:2021 – Security Misconfiguration | WSTG-CONF-04 (Review Storage Permissions)
- **Objetivo:** Verificar la existencia, estado de aprovisionamiento y políticas de acceso del bucket de almacenamiento `catalog-media` en Supabase Storage para evitar fallos silenciosos y subida irrestricta de archivos ejecutables.
- **Severidad:** Alta
- **Herramientas:** `cURL.exe`.
- **Precondiciones:** Clave `anon` de Supabase.
- **Pasos de Ejecución:**
  1. Consultar el estado del bucket en el API de Storage de Supabase:
     ```powershell
     $ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c"
     curl.exe -s -i -H "apikey: $ANON_KEY" "https://xvrnssesbkzxeusubzes.supabase.co/storage/v1/bucket/catalog-media"
     ```
  2. Intentar subir un archivo binario `.exe` o `.html` malicioso al almacenamiento:
     ```powershell
     curl.exe -s -i -X POST -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" -H "Content-Type: text/html" --data "<h1>Infeccion</h1>" "https://xvrnssesbkzxeusubzes.supabase.co/storage/v1/object/catalog-media/test_probe.html"
     ```
- **Resultado Esperado:**
  - El bucket debe existir (no responder con `404 NoSuchBucket`).
  - La subida anónima de archivos no autorizados debe ser denegada por políticas de Storage RLS, admitiendo únicamente extensiones válidas de imágenes (`image/webp`, `image/png`, `application/pdf`).

---

#### SEC-AUTH: Autenticación Administrativa por NIP y Criptografía

### SEC-AUTH-001: Resistencia a Fuerza Bruta Offline sobre Hash NIP (SHA-256 + Salt)
- **Vector / Categoría OWASP:** A02:2021 – Cryptographic Failures & A07:2021 – Identification and Authentication Failures | WSTG-CRYP-04 (Testing for Weak Encryption)
- **Objetivo:** Demostrar la vulnerabilidad del esquema criptográfico actual basado en SHA-256 con Salt público estático (`TYNOR_KIOSK_SALT_2026`) frente a ataques de fuerza bruta offline sobre un espacio de 4 dígitos (0000 a 9999).
- **Severidad:** Alta
- **Herramientas:** Node.js script adversario (`tests/test_auth_crypto_adversarial.mjs`).
- **Precondiciones:** Acceso al código fuente de `src/services/productManager.js` o extracción del bundle JS.
- **Pasos de Ejecución:**
  1. Ejecutar el script de análisis que itera los 10,000 posibles PINs numéricos concatenados con el Salt (es mandatorio invocar `--loader ./tests/loader.mjs` para que Node.js resuelva importaciones ESM sin extensión en el árbol de módulos del frontend):
     ```powershell
     node --loader ./tests/loader.mjs tests/test_auth_crypto_adversarial.mjs
     ```
  2. Medir el tiempo requerido por el script para hallar la preimagen del hash por defecto:
     `573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac`
  3. Confirmar que el PIN descubierto corresponde exactamente a `9824`.
- **Resultado Esperado:**
  - El ataque offline completa en menos de 50 milisegundos en hardware convencional.
  - La auditoría concluye que un NIP de 4 dígitos con salt estático y función hash simple no ofrece resistencia suficiente sin funciones de derivación lentas (PBKDF2, Argon2id) o verificación en servidor.

### SEC-AUTH-002: Resistencia a Ataques de Fuerza Bruta Online en Interfaz de Administración
- **Vector / Categoría OWASP:** A07:2021 – Identification and Authentication Failures | WSTG-ATHN-03 (Testing for Weak Lock Out Mechanism)
- **Objetivo:** Verificar si la interfaz de autenticación `AdminAuthModal.jsx` implementa bloqueo temporal por intentos fallidos, retardos exponenciales (rate limiting en UI) o alertas de seguridad ante intentos repetidos de acceso.
- **Severidad:** Alta
- **Herramientas:** Script de prueba de integración Playwright.
- **Precondiciones:** Aplicación abierta en el modal de autenticación.
- **Pasos de Ejecución:**
  1. Automatizar la introducción continua de 10 NIPs incorrectos consecutivos en la interfaz modal:
     - Intentos: `0001`, `0002`, `0003`, ..., `0010`.
  2. Medir si el componente aplica un retardo progresivo (backoff) o bloquea el botón de envío tras 3 o 5 fallos.
  3. Comprobar si los intentos fallidos persisten en `localStorage` o `sessionStorage` para evitar el reseteo mediante recarga de página (`F5`).
- **Resultado Esperado:**
  - El sistema debe bloquear temporalmente el formulario tras 5 intentos fallidos durante al menos 60 segundos.
  - El estado de bloqueo debe persistir en almacenamiento local para sobrevivir al refresco del navegador.

### SEC-AUTH-003: Manipulación de Credenciales de Sesión Administrativa en Almacenamiento Local
- **Vector / Categoría OWASP:** A01:2021 – Broken Access Control | WSTG-CLNT-12 (Testing for Browser Storage)
- **Objetivo:** Evaluar si un usuario en un kiosco público puede manipular `localStorage` para forzar el estado de autenticación administrativa sin conocer el NIP.
- **Severidad:** Alta
- **Herramientas:** Consola de desarrollador del navegador.
- **Precondiciones:** Acceso físico o lógico al navegador del kiosco.
- **Pasos de Ejecución:**
  1. Abrir la consola de JavaScript y ejecutar:
     ```javascript
     localStorage.setItem('tynor_admin_credentials', JSON.stringify({
       username: 'admin',
       nipHash: '573e2dc11281e6e5f5642973c2da5351a8838d662c4c55d80973c344171382ac',
       timestamp: Date.now()
     }));
     ```
  2. Intentar abrir el modal de administración haciendo clic en el engrane de configuración en el pie de página.
  3. Verificar si la aplicación valida la firma criptográfica o tiempo de vida (TTL) de la sesión.
- **Resultado Esperado:**
  - La sesión administrativa no debe depender exclusivamente de una bandera o JSON en `localStorage` sin firma temporal.
  - El acceso a mutaciones críticas debe requerir reautenticación o validar un token firmado.

---

#### SEC-API: Seguridad en Endpoints Serverless y Enrutamiento SMTP

### SEC-API-001: Restricción y Validación Estricta de CORS en `/api/send-email.js`
- **Vector / Categoría OWASP:** A05:2021 – Security Misconfiguration | WSTG-CONF-07 (Testing Cross Origin Resource Sharing)
- **Objetivo:** Comprobar que el endpoint serverless de envío de cotizaciones rechace peticiones `POST` u `OPTIONS` emitidas desde orígenes no autorizados mediante cabeceras `Origin` manipuladas.
- **Severidad:** Alta
- **Herramientas:** `cURL.exe`.
- **Precondiciones:** Endpoint accesible en `https://catalogotyn.vercel.app/api/send-email`.
- **Pasos de Ejecución:**
  1. Enviar una solicitud HTTP OPTIONS (preflight) simulando un origen malicioso:
     ```powershell
     curl.exe -s -i -X OPTIONS -H "Origin: https://evil-attacker.com" -H "Access-Control-Request-Method: POST" "https://catalogotyn.vercel.app/api/send-email"
     ```
  2. Enviar una solicitud directa con origen legítimo:
     ```powershell
     curl.exe -s -i -X OPTIONS -H "Origin: https://catalogotyn.vercel.app" -H "Access-Control-Request-Method: POST" "https://catalogotyn.vercel.app/api/send-email"
     ```
- **Resultado Esperado:**
  - Para el origen `https://evil-attacker.com`, el servidor debe retornar HTTP `403 Forbidden` y no emitir la cabecera `Access-Control-Allow-Origin`.
  - Para el origen oficial, debe responder HTTP `200 OK` con cabeceras CORS acotadas a dicho origen.

### SEC-API-002: Prevención de Inyección de Cabeceras CRLF en Parámetros de Correo
- **Vector / Categoría OWASP:** A03:2021 – Injection | WSTG-INPV-12 (Testing for IMAP/SMTP Injection)
- **Objetivo:** Validar que los campos `recipientEmail`, `customerName` y `quoteNumber` procesados por `api/send-email.js` sean inmunes a inyección de saltos de línea (`\r\n` / `%0D%0A`), impidiendo la adición de destinatarios ocultos (`Bcc:`) o la reescritura del asunto.
- **Severidad:** Crítica
- **Herramientas:** `cURL.exe`.
- **Precondiciones:** Conectividad con la API serverless.
- **Pasos de Ejecución:**
  1. Enviar un payload que intente inyectar una cabecera `Bcc` maliciosa a través del campo de correo electrónico:
     ```powershell
     curl.exe -s -i -X POST -H "Content-Type: application/json" -H "Origin: https://catalogotyn.vercel.app" -d '{\"recipientEmail\":\"victim@tynor.com.mx\r\nBcc: spy@evil.com\",\"customerName\":\"[TEST-AUDIT] Probe\",\"items\":[]}' "https://catalogotyn.vercel.app/api/send-email"
     ```
  2. Enviar un payload con saltos de línea en el número de cotización:
     ```powershell
     curl.exe -s -i -X POST -H "Content-Type: application/json" -H "Origin: https://catalogotyn.vercel.app" -d '{\"recipientEmail\":\"victim@tynor.com.mx\",\"quoteNumber\":\"COT-001\r\nX-Injected-Header: Injected\",\"items\":[]}' "https://catalogotyn.vercel.app/api/send-email"
     ```
- **Resultado Esperado:**
  - El validador `hasCrlf()` en `api/send-email.js` detecta los caracteres `\r` o `\n` y aborta de inmediato la operación, respondiendo con HTTP `400 Bad Request` y mensaje descriptivo de violación de entrada.

### SEC-API-003: Prevención de Open Relay y SSRF hacia Redes Privadas y Metadatos de la Nube
- **Vector / Categoría OWASP:** A10:2021 – Server-Side Request Forgery (SSRF) | WSTG-INPV-19 (Testing for SSRF)
- **Objetivo:** Comprobar que el parámetro de configuración de host SMTP (`config.host`) suministrado por el cliente no permita utilizar el servidor Vercel para conectarse a direcciones IP de loopback (`127.0.0.1`), subredes privadas RFC 1918 (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) ni al servicio de metadatos de Vercel/AWS (`169.254.169.254`).
- **Severidad:** Crítica
- **Herramientas:** `cURL.exe`.
- **Precondiciones:** API serverless desplegada.
- **Pasos de Ejecución:**
  1. Enviar una solicitud de envío especificando como host la IP de metadatos de la nube:
     ```powershell
     curl.exe -s -i -X POST -H "Content-Type: application/json" -H "Origin: https://catalogotyn.vercel.app" -d '{\"config\":{\"host\":\"169.254.169.254\",\"port\":80},\"recipientEmail\":\"test@tynor.com.mx\",\"items\":[]}' "https://catalogotyn.vercel.app/api/send-email"
     ```
  2. Enviar una solicitud con un dominio DNS que resuelva a `127.0.0.1` (ej. `127.0.0.1.nip.io`):
     ```powershell
     curl.exe -s -i -X POST -H "Content-Type: application/json" -H "Origin: https://catalogotyn.vercel.app" -d '{\"config\":{\"host\":\"127.0.0.1.nip.io\",\"port\":25},\"recipientEmail\":\"test@tynor.com.mx\",\"items\":[]}' "https://catalogotyn.vercel.app/api/send-email"
     ```
- **Resultado Esperado:**
  - El servidor rechaza inmediatamente la conexión respondiendo con HTTP `400 Bad Request` o `403 Forbidden` (`Host prohibido o no seguro`).
  - La protección debe resolver el nombre de host vía DNS antes de conectar para mitigar ataques DNS Rebinding hacia subredes privadas.

### SEC-API-004: Resiliencia del Limitador de Tasa (Rate Limiting) ante Cold Starts en Vercel
- **Vector / Categoría OWASP:** A04:2021 – Insecure Design | WSTG-ATHN-04 (Testing for Bypassing Rate Limits)
- **Objetivo:** Evaluar la efectividad del limitador de tasa de 15 solicitudes por minuto por IP implementado en `rateLimitMap` de `api/send-email.js` ante escalado horizontal y múltiples instancias de Vercel Functions.
- **Severidad:** Media-Alta
- **Herramientas:** Script Node.js de envío concurrente.
- **Precondiciones:** Conectividad con la API serverless.
- **Pasos de Ejecución:**
  1. Enviar desde una misma IP una ráfaga secuencial de 20 peticiones HTTP POST en menos de 10 segundos.
  2. Verificar que las peticiones 1 a 15 retornen códigos de procesamiento (`200` o `400` de validación) y las peticiones 16 a 20 retornen estrictamente `429 Too Many Requests`.
  3. Forzar el inicio de múltiples contenedores serverless concurrentes enviando solicitudes en paralelo desde distintos hilos y verificar si el límite en memoria de JavaScript se evade al instanciarse nuevas funciones con `rateLimitMap` vacío.
- **Resultado Esperado:**
  - El servidor aplica el bloqueo HTTP 429 con cabecera `Retry-After`.
  - La auditoría recomienda migrar el almacenamiento del rate limit a un almacén distribuido de baja latencia (ej. Upstash Redis / Vercel KV) para garantizar coherencia entre todos los contenedores serverless activos.

### SEC-API-005: Auditoría de Validación de Certificados TLS en Sincronización IMAP
- **Vector / Categoría OWASP:** A02:2021 – Cryptographic Failures | WSTG-CRYP-01 (Testing for Weak SSL/TLS Ciphers)
- **Objetivo:** Comprobar si la sincronización de correos enviados en la carpeta "Enviados" vía IMAP (`imapflow`) en `api/send-email.js:306` permite certificados inválidos o autofirmados mediante la bandera `tls: { rejectUnauthorized: false }`.
- **Severidad:** Alta
- **Herramientas:** Inspección estática de código AST y sonda con proxy TLS intermedio.
- **Precondiciones:** Código fuente de `api/send-email.js`.
- **Pasos de Ejecución:**
  1. Inspeccionar la línea 306 de `api/send-email.js`:
     ```javascript
     tls: { rejectUnauthorized: false }
     ```
  2. Analizar el impacto de desactivar la verificación de certificados ante un ataque de intermediario (Man-in-the-Middle) en la red entre Vercel y el servidor de correo institucional.
- **Resultado Esperado:**
  - La directiva insegura `rejectUnauthorized: false` debe ser eliminada y sustituida por validación estricta `rejectUnauthorized: true`, garantizando que las credenciales transmitidas por IMAP no puedan ser interceptadas por certificados falsificados.

---

## 3. Protocolos de Seguridad Operativa y Salvaguardas en Producción (RoE)

La ejecución de pruebas activas sobre el entorno en producción (`https://catalogotyn.vercel.app` y Supabase `xvrnssesbkzxeusubzes`) requiere la aplicación estricta de las siguientes **Reglas de Compromiso (Rules of Engagement - RoE)** para salvaguardar la integridad de los datos clínicos, la continuidad operativa del negocio y la reputación del dominio.

---

### 3.1 Principio de Inocuidad y Cargas No Destructivas

Queda formalmente prohibida la ejecución de comandos o payloads destructivos sobre el entorno productivo.
* **Prohibición Total:** Sentencias `DELETE`, `DROP TABLE`, `TRUNCATE`, o mutaciones de datos en masa sobre registros legítimos existentes.
* **Cargas Inocuas Autorizadas:**
  * Sondas XSS: Cadenas inocuas de diagnóstico pasivo que emitan logs en consola: `<script>/*TEST-AUDIT-SAFE*/console.log('audit-probe')</script>` o cadenas de prueba de cierre de tags `test-probe"'>`.
  * Sondas SQLi: Aserciones lógicas neutras `' OR 'TEST-AUDIT'='TEST-AUDIT` o retardos breves acotados a $\le 2\text{ s}$ (`pg_sleep(2)`).
  * Sondas CRLF: `safe-audit@tynor.com.mx\r\nX-Audit-Probe: true`.

---

### 3.2 Ventana Operativa de Bajo Tráfico

* **Horario Obligatorio:** Toda prueba automatizada DAST, escaneo dinámico con OWASP ZAP, pruebas de carga o sondeos de concurrencia en producción deben ejecutarse exclusivamente dentro de la **ventana de bajo tráfico: 23:00 a 05:00 CST (UTC-6)**.
* **Pruebas Manuales:** Pruebas funcionales de baja frecuencia ($\le 1\text{ req/s}$) están autorizadas en horario diurno siempre que no impliquen estrés sobre los servidores.

---

### 3.3 Taxonomía de Trazabilidad y Cabeceras de Auditoría

Todo artefacto o registro temporal generado durante la ejecución de las pruebas debe identificarse de forma unívoca:
1. **Prefijo en Registros de Datos:** Todo nombre de cliente, prospecto, cotización o producto de prueba debe comenzar obligatoriamente con el prefijo:
   ```text
   [TEST-AUDIT]
   ```
   *Ejemplo de Lead:* `[TEST-AUDIT] Dr. Roberto QA Especialista`  
   *Ejemplo de Email:* `test-audit-lead-01@tynor.com.mx`  
   *Ejemplo de Producto:* `[TEST-AUDIT] Rodillera Estabilizadora Test`
2. **Cabecera HTTP de Auditoría:** Toda herramienta automatizada, script de k6 o comando cURL debe incluir la cabecera personalizada:
   ```http
   X-Audit-Agent: TynorKiosk-SecurityAudit/1.0 (Contact: seguridad@tynor.com.mx)
   ```

---

### 3.4 Limitadores de Tasa y Concurrencia en Vivo

Para no activar los filtros automáticos anti-DDoS de Vercel ni saturar el pool de conexiones de Supabase:
* **Tasa Máxima en Vercel Edge:** $\le 5\text{ peticiones por segundo}$ para escaneos DAST.
* **Concurrencia Máxima Estricta en Supabase Producción:** $\le 10\text{ conexiones concurrentes simultáneas}$ contra la base de datos de producción (resguardando el pool físico de 60 conexiones para usuarios reales en clínicas y hospitales).
  > ⚠️ **Regla de Aislamiento Operativo:** Queda estrictamente prohibido ejecutar perfiles de carga mayores a 10 VUs (`peak` de 100 VUs o `stress` de 250 VUs) apuntando a los endpoints de Supabase en el entorno de producción (`TARGET_ENV=production`). Las pruebas de carga masiva de base de datos DEBEN ejecutarse exclusivamente en un entorno Staging dedicado o localmente con Supabase CLI dockerizado. En producción, la carga masiva solo se permite contra el CDN estático de Vercel (`${BASE_URL}/`).
* **Límite de Envíos SMTP:** Máximo $\le 5\text{ correos electrónicos de prueba}$ por sesión de auditoría, espaciados entre sí por un intervalo mínimo de $15\text{ segundos}$ y dirigidos exclusivamente a buzones controlados (`sink-test@tynor.com.mx`).

---

### 3.5 Procedimiento Automatizado de Reversión y Limpieza (Rollback)

Inmediatamente al concluir una sesión de pruebas (y en un plazo máximo no superior a **15 minutos**), el auditor debe ejecutar el siguiente protocolo de limpieza (corregido conforme al esquema real de base de datos):

```powershell
# Script de Reversión y Purga de Datos de Auditoría en Producción
$SUPABASE_URL = "https://xvrnssesbkzxeusubzes.supabase.co"
$SERVICE_ROLE_KEY = $env:SUPABASE_SERVICE_ROLE_KEY # Obtenida de bóveda segura en ejecución controlada

# 1. Purgar prospectos de prueba (utilizando la columna real 'nombre_completo')
Write-Host "[ROLLBACK] Purgando prospectos con prefijo [TEST-AUDIT]..."
curl.exe -s -X DELETE -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" "$SUPABASE_URL/rest/v1/prospectos_comerciales?nombre_completo=like.*[TEST-AUDIT]*"

# 2. Purgar productos de catálogo creados por pruebas
Write-Host "[ROLLBACK] Purgando productos de catálogo de prueba..."
curl.exe -s -X DELETE -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" "$SUPABASE_URL/rest/v1/productos_catalogo?name=like.*[TEST-AUDIT]*"

# 3. Restablecer branding oficial (únicamente columnas existentes: brand_color, logo_url)
Write-Host "[ROLLBACK] Restaurando configuración oficial de branding..."
$RESET_PAYLOAD = '{\"brand_color\":\"#10B4C1\",\"logo_url\":\"/assets/logo.webp\"}'
curl.exe -s -X PATCH -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" -H "Content-Type: application/json" -d $RESET_PAYLOAD "$SUPABASE_URL/rest/v1/configuracion_kiosco?id=eq.global"

Write-Host "[ROLLBACK] Procedimiento de limpieza concluido exitosamente."
```

Adicionalmente, en los dispositivos físicos de prueba utilizados, se debe ejecutar en la consola del navegador:
```javascript
localStorage.removeItem('tynor_pending_leads');
localStorage.removeItem('tynor_custom_products');
localStorage.removeItem('tynor_branding_color');
localStorage.removeItem('tynor_branding_logo');
console.log('[ROLLBACK] Almacenamiento local del kiosco saneado.');
```

---

### 3.6 Interruptor de Parada de Emergencia (Emergency Kill-Switch)

La auditoría debe suspenderse de manera inmediata e incondicional ante la ocurrencia de cualquiera de las siguientes condiciones de umbral:
1. **Tasa de error HTTP $\ge 1.0\%$** en las métricas de monitoreo de Vercel o Supabase.
2. **Latencia TTFB $> 2,500\text{ ms}$** sostenida durante más de 60 segundos.
3. **Consumo de egress en Supabase $> 1.5\text{ GB}$** (riesgo de agotar los 2 GB del Free Tier).
4. **Reporte de anomalías** o congelamiento en pantallas de kioscos físicos en operación comercial.

**Acción Inmediata:** Abortar todos los procesos en ejecución (`Ctrl+C` / `killall`), ejecutar el script de rollback y notificar al Responsable Técnico del proyecto.

---

## 4. Plan Maestro de Pruebas de Rendimiento y PWA

### 4.1 Métricas Clave y Umbrales Cuantitativos de Core Web Vitals

Las pruebas de rendimiento evalúan la experiencia de usuario bajo los estándares oficiales de **Google Core Web Vitals** y métricas complementarias de diagnóstico web, adaptadas a condiciones de hardware táctil embebido y dispositivos móviles en redes 4G/Fast 3G:

| Métrica | Nombre Completo | Bueno (Aprobado) | Requiere Atención | Crítico (Rechazo) | Dispositivo / Red |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **LCP** | Largest Contentful Paint | $\le 2.5\text{ s}$ (4G / PWA)<br>$\le 3.5\text{ s}$ (Fast 3G frío) | $2.5\text{ s} - 4.0\text{ s}$ | $> 4.0\text{ s}$ | 4G LTE / Fast 3G + CPU 4x |
| **CLS** | Cumulative Layout Shift | $\le 0.10$ | $0.10 - 0.25$ | $> 0.25$ | Kiosco Táctil / Desktop |
| **INP** | Interaction to Next Paint | $\le 200\text{ ms}$ | $200\text{ ms} - 500\text{ ms}$ | $> 500\text{ ms}$ | Eventos táctiles en pantalla |
| **FCP** | First Contentful Paint | $\le 1.8\text{ s}$ | $1.8\text{ s} - 3.0\text{ s}$ | $> 3.0\text{ s}$ | Arranque en frío (Cache limpia) |
| **TTFB** | Time to First Byte | $\le 800\text{ ms}$ | $800\text{ ms} - 1,800\text{ ms}$ | $> 1,800\text{ ms}$ | Borde Vercel CDN |
| **FPS 3D** | Cuadros por Segundo (3D Viewer) | $\ge 55\text{ FPS}$ | $40 - 54\text{ FPS}$ | $< 40\text{ FPS}$ | Rotación y modo rayos X |

---

### 4.2 Matriz de Casos de Prueba de Rendimiento

---

#### PERF-CWV: Core Web Vitals y Rendimiento del Hilo Principal

### PERF-CWV-001: Medición y Optimización de LCP ante Saturación de Imágenes Eager
- **Métrica / Área:** Largest Contentful Paint (LCP) | Hilo Principal de Renderizado
- **Objetivo:** Cuantificar el impacto del atributo `loading="eager"`, `fetchpriority="high"` y `decoding="sync"` en las primeras 12 tarjetas de producto (`CatalogView.jsx:146-168`) y verificar la mejora al restringirlo a las primeras 3 tarjetas visibles con decodificación asíncrona (`decoding="async"`).
- **Umbral Objetivo:**
  - **Entorno Caliente / 4G LTE / PWA Instalada:** LCP $\le 2.5\text{ s}$ (Ideal en Desktop $\le 2.0\text{ s}$).
  - **Entorno Frío Extremo (Fast 3G + CPU 4x Slowdown):** Calibrado a LCP $\le 3.5\text{ s}$ (debido a los límites físicos intrínsecos de TTFB ~600ms, transferencia de ~103 KB gzip y parseo/hidratación CSR de React 18 en hilo único sin Server-Side Rendering).
- **Escenario y Configuración:** Navegador Chromium vía Lighthouse / Chrome DevTools. Perfil de red estrangulada: Fast 3G (1.6 Mbps download, 750 kbps upload, 150 ms RTT) con CPU 4x Slowdown.
- **Pasos de Medición:**
  1. Limpiar caché del navegador y almacenamiento del Service Worker (arranque en frío).
  2. Cargar `https://catalogotyn.vercel.app` y capturar traza de rendimiento con `PerformanceObserver`:
     ```javascript
     new PerformanceObserver((entryList) => {
       for (const entry of entryList.getEntries()) {
         console.log('[LCP Candidate]:', entry.startTime, entry.element);
       }
     }).observe({ type: 'largest-contentful-paint', buffered: true });
     ```
  3. Identificar el elemento causante del LCP (típicamente el banner o la primera tarjeta de producto).
  4. Comparar el consumo de CPU durante los primeros 2,000 ms entre `decoding="sync"` y `decoding="async"`.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** LCP $\le 2.5\text{ s}$ en 4G/PWA caché tibia, o $\le 3.5\text{ s}$ en arranque en frío Fast 3G + 4x CPU; decodificación asíncrona no bloquea el hilo principal más de 50 ms.
  - 🟡 **Requiere Atención:** LCP entre $3.5\text{ s}$ y $4.5\text{ s}$ en Fast 3G frío (o $2.5\text{ s} - 3.5\text{ s}$ en 4G).
  - 🔴 **Crítico:** LCP $> 4.5\text{ s}$ en Fast 3G ($> 3.5\text{ s}$ en 4G) o contienda de red por más de 6 imágenes descargadas concurrentemente con alta prioridad.

### PERF-CWV-002: Medición de Cumulative Layout Shift (CLS) en Paneles Dinámicos y Branding
- **Métrica / Área:** Cumulative Layout Shift (CLS) | Estabilidad Visual
- **Objetivo:** Verificar que la apertura del cajón de anatomía (`AnatomyView.jsx`), el renderizado de imágenes de productos asociados sin dimensiones explícitas y la llegada asíncrona de la configuración de branding (`brandingService.js`) no provoquen desplazamientos bruscos de elementos en el DOM.
- **Umbral Objetivo:** CLS $\le 0.05$ (Límite estricto: $\le 0.10$).
- **Escenario y Configuración:** Navegación interactiva completa con PerformanceObserver (`layout-shift`).
- **Pasos de Medición:**
  1. Iniciar registro de desplazamientos en consola:
     ```javascript
     let clsScore = 0;
     new PerformanceObserver((entryList) => {
       for (const entry of entryList.getEntries()) {
         if (!entry.hadRecentInput) {
           clsScore += entry.value;
           console.log('[CLS Shift]:', entry.value, 'Total:', clsScore);
         }
       }
     }).observe({ type: 'layout-shift', buffered: true });
     ```
  2. Abrir la aplicación, esperar la resolución de `brandingService.syncFromCloud()`.
  3. Navegar a la pestaña "Vista 3D", pulsar sobre los puntos calientes (hotspots) de Rodilla, Hombro y Tobillo, y abrir los cajones laterales de productos.
  4. Inspeccionar si los elementos `img` en `.drawer-item-img` tienen atributos fijos `width` y `height`.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** CLS $\le 0.05$; no se perciben saltos visuales al sincronizar colores o abrir modales.
  - 🟡 **Requiere Atención:** CLS entre $0.05$ y $0.10$.
  - 🔴 **Crítico:** CLS $> 0.10$; desplazamiento de botones durante la pulsación del usuario.

### PERF-CWV-003: Medición de Interaction to Next Paint (INP) en Filtrado de Catálogo
- **Métrica / Área:** Interaction to Next Paint (INP) | Capacidad de Respuesta Táctil
- **Objetivo:** Evaluar la latencia de respuesta del hilo principal al teclear búsquedas en tiempo real sobre el catálogo de más de 180 productos en `CatalogView.jsx:25-30`, contrastando la ejecución no memorizada frente al uso de `useMemo`.
- **Umbral Objetivo:** INP $\le 150\text{ ms}$ (Límite normativo: $\le 200\text{ ms}$).
- **Escenario y Configuración:** Emulación móvil con CPU estrangulada 4x (simulando tablet o kiosco Android de gama media-baja).
- **Pasos de Medición:**
  1. Enfocar el campo de búsqueda de productos.
  2. Inyectar automáticamente mediante script o tecleo manual una secuencia de 15 caracteres (ej. "inmovilizador r").
  3. Registrar la duración de las tareas largas (Long Tasks $> 50\text{ ms}$) durante la entrada de texto:
     ```javascript
     new PerformanceObserver((list) => {
       for (const entry of list.getEntries()) {
         console.warn('[Long Task in UI Thread]:', entry.duration, 'ms');
       }
     }).observe({ entryTypes: ['longtask'] });
     ```
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** INP $\le 150\text{ ms}$; ninguna tarea larga supera $100\text{ ms}$ durante el tecleo gracias a `useMemo`.
  - 🟡 **Requiere Atención:** INP entre $150\text{ ms}$ y $200\text{ ms}$.
  - 🔴 **Crítico:** INP $> 200\text{ ms}$; retardo perceptible o congelamiento visual del teclado en pantalla.

### PERF-CWV-004: Medición de INP durante Síntesis Síncrona de PDF en el Hilo Principal y Mandato de Web Worker
- **Métrica / Área:** Interaction to Next Paint (INP) | Bloqueo de Interfaz por Tareas Pesadas
- **Objetivo:** Medir el tiempo de congelamiento de la interfaz de usuario durante la síntesis de cotizaciones PDF con `jsPDF` y rasterización de logotipos en `pdfGenerator.js:57-125`, evaluando y prescribiendo el mandato de offloading a un Web Worker o diferimiento asíncrono.
- **Diagnóstico y Mandato de Arquitectura:**
  - En `src/services/pdfGenerator.js`, la función `createQuotePdf` ejecuta de forma puramente síncrona la instanciación de `jsPDF`, la construcción de tablas con `autoTable` y la codificación binaria en el hilo principal.
  - Con un carrito de 20-25 productos ortopédicos bajo CPU estrangulada 4x, esta operación bloquea el bucle de eventos durante $350 - 750\text{ ms}$, violando el límite normativo de INP $\le 200\text{ ms}$ ante cualquier pulsación táctil concurrente.
  - **Mandato:** La síntesis pesada de PDF DEBE ser delegada a un Web Worker dedicado (`src/workers/pdfWorker.js`) o diferida tras un tick asíncrono (`setTimeout(..., 0)` o `requestIdleCallback`) permitiendo que la interfaz renderice inmediatamente el estado de carga (`isGenerating: true`) sin degradar la capacidad de respuesta táctil.
- **Umbral Objetivo:** INP $\le 150\text{ ms}$ (Límite estricto: $\le 200\text{ ms}$); latencia de feedback visual (spinner o modal) $\le 50\text{ ms}$.
- **Escenario y Configuración:** Carrito cargado con 25 artículos médicos. Clic en "Generar Cotización PDF".
- **Pasos de Medición:**
  1. Registrar la marca de tiempo inmediatamente antes de solicitar la generación del PDF.
  2. Ejecutar la llamada y verificar que el spinner de carga renderice en menos de 50 ms sin congelamiento de UI.
  3. Pulsar simultáneamente en otros botones del modal durante la generación para registrar el INP mediante `PerformanceObserver`:
     ```javascript
     new PerformanceObserver((entryList) => {
       for (const entry of entryList.getEntries()) {
         console.log('[INP Interaction]:', entry.name, 'Duration:', entry.duration, 'ms');
       }
     }).observe({ type: 'event', buffered: true, durationThreshold: 16 });
     ```
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** INP $\le 150\text{ ms}$ (y siempre $\le 200\text{ ms}$); la generación se delega fuera del hilo principal o se difiere asíncronamente permitiendo feedback visual inmediato.
  - 🟡 **Requiere Atención:** INP entre $200\text{ ms}$ y $350\text{ ms}$ con tareas largas transitorias no críticas.
  - 🔴 **Crítico:** INP $> 350\text{ ms}$; congelamiento perceptible de la pantalla o advertencia del navegador "Script no responde".

### PERF-CWV-005: Rendimiento de Cuadros por Segundo (FPS) en Visor 3D Anatómico
- **Métrica / Área:** Cuadros por Segundo (FPS) | Carga GPU y Renderizado WebGL
- **Objetivo:** Comprobar que el visor anatómico `<model-viewer>` mantenga una tasa de cuadros estable durante la rotación automática (`auto-rotate`), la interacción de órbita con el dedo y la transición de modo ("Cuerpo" vs "Esqueleto").
- **Umbral Objetivo:** Tasa promedio $\ge 55\text{ FPS}$ en Desktop y $\ge 45\text{ FPS}$ en kiosco táctil/móvil.
- **Escenario y Configuración:** Chrome Performance Tab midiendo FPS en pantalla durante 15 segundos de rotación continua.
- **Pasos de Medición:**
  1. Abrir la vista `AnatomyView`.
  2. Ejecutar script de medición de tasa de refresco:
     ```javascript
     let frameCount = 0;
     let lastTime = performance.now();
     function measureFps() {
       frameCount++;
       const now = performance.now();
       if (now - lastTime >= 1000) {
         console.log('[3D Viewer FPS]:', frameCount);
         frameCount = 0;
         lastTime = now;
       }
       requestAnimationFrame(measureFps);
     }
     measureFps();
     ```
  3. Alternar el modo de rayos X (`handleToggleMode`) y medir la caída de cuadros durante la compilación de shaders y parseo del archivo `Model_Skeleton.glb`.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** FPS sostenido $\ge 55$; caída mínima transitoria durante el cambio de modo $\ge 40\text{ FPS}$.
  - 🟡 **Requiere Atención:** FPS entre $40$ y $54\text{ FPS}$.
  - 🔴 **Crítico:** FPS $< 40\text{ FPS}$ sostenido o congelamiento superior a 500 ms al cambiar de modelo.

### PERF-CWV-006: Recuperación ante Pérdida de Contexto WebGL (`webglcontextlost`)
- **Métrica / Área:** Resiliencia de Renderizado 3D | Kiosco Desatendido
- **Objetivo:** Verificar que el componente `AnatomyView.jsx` no quede permanentemente en negro si el sistema operativo o el navegador reciclan el contexto WebGL tras horas de inactividad o cambio de aplicaciones.
- **Severidad:** Alta
- **Herramientas:** Chrome Extension "WebGL Context Loss Simulator" o instrucción manual de depuración.
- **Precondiciones:** Visor 3D renderizado.
- **Pasos de Ejecución:**
  1. Forzar la pérdida de contexto ejecutando en la consola de Chrome:
     ```javascript
     const mv = document.querySelector('model-viewer');
     const canvas = mv.shadowRoot.querySelector('canvas');
     const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
     gl.getExtension('WEBGL_lose_context').loseContext();
     ```
  2. Comprobar si la aplicación implementa el listener `webglcontextlost` (invocando `event.preventDefault()`) y recupera el modelo automáticamente sin requerir recarga completa del navegador.
- **Resultado Esperado:**
  - El visor detecta la pérdida, previene el fallo irrecuperable y restaura el renderizado 3D en menos de 2 segundos.

---

#### PERF-BND: Presupuesto de Bundles, Code-Splitting y Optimización de Assets

### PERF-BND-001: Verificación de Presupuestos de Bundles Iniciales (Vite JS & CSS)
- **Métrica / Área:** Tamaño de Archivo Transferido (Gzip / Brotli)
- **Objetivo:** Comprobar que el paquete JavaScript inicial cargado para renderizar la vista de catálogo no supere los 200 KB gzip y que el CSS no supere los 50 KB gzip.
- **Umbral Objetivo:**
  - JavaScript Core Inicial $\le 200\text{ KB}$ gzip (Presupuesto ideal: $\le 90\text{ KB}$ gzip).
  - CSS Core Inicial $\le 50\text{ KB}$ gzip (Presupuesto ideal: $\le 25\text{ KB}$ gzip).
- **Herramientas:** `vite build`, `node` con biblioteca `zlib`.
- **Pasos de Medición:**
  1. Ejecutar la compilación de producción:
     ```powershell
     npm run build
     ```
  2. Medir el peso comprimido exacto del archivo `dist/assets/index-*.js` y `dist/assets/index-*.css`:
     ```powershell
     node -e "const fs = require('fs'); const zlib = require('zlib'); const js = fs.readFileSync('dist/assets/index-CzswUHP9.js'); const css = fs.readFileSync('dist/assets/index-ChrAub87.css'); console.log('JS Initial Gzip:', (zlib.gzipSync(js).length/1024).toFixed(2), 'KB'); console.log('CSS Gzip:', (zlib.gzipSync(css).length/1024).toFixed(2), 'KB');"
     ```
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** JS Inicial $\le 200\text{ KB}$ gzip (Línea base observada: **78.63 KB gzip**); CSS Inicial $\le 50\text{ KB}$ gzip (Línea base observada: **20.43 KB gzip**).
  - 🟡 **Requiere Atención:** JS Inicial entre $200\text{ KB}$ y $250\text{ KB}$ gzip.
  - 🔴 **Crítico:** JS Inicial $> 250\text{ KB}$ gzip o CSS Inicial $> 50\text{ KB}$ gzip.

### PERF-BND-002: Presupuesto Acumulativo de Chunks Diferidos y Configuración de `manualChunks`
- **Métrica / Área:** Rollup Code-Splitting | Evitación de Chunks Monolíticos y Micro-fragmentación
- **Objetivo:** Evaluar la configuración de Rollup en `vite.config.js:139` para separar bibliotecas pesadas de terceros (`vendor-react`, `vendor-pdf`, `vendor-pdfjs`, `vendor-icons`) y verificar que el peso acumulativo de todos los módulos no exceda 500 KB gzip.
- **Umbral Objetivo:** JS Acumulativo Total $\le 500\text{ KB}$ gzip (Alerta tolerable: $500 - 650\text{ KB}$ gzip).
- **Pasos de Medición:**
  1. Sumar los tamaños de todos los chunks generados en `dist/assets/*.js`:
     ```powershell
     node -e "const fs = require('fs'); const zlib = require('zlib'); let total = 0; fs.readdirSync('dist/assets').filter(f => f.endsWith('.js')).forEach(f => { total += zlib.gzipSync(fs.readFileSync('dist/assets/' + f)).length; }); console.log('Total JS Chunks Gzip:', (total/1024).toFixed(2), 'KB');"
     ```
  2. Verificar que no se generen más de 10 micro-chunks de iconos individuales (< 1 KB) consolidándolos en un solo bundle `vendor-icons`.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** Total JS $\le 500\text{ KB}$ gzip; chunks críticos aislados.
  - 🟡 **Requiere Atención:** Total JS entre $500\text{ KB}$ y $650\text{ KB}$ gzip (Línea base actual: 586.2 KB gzip debido a jsPDF y PDF.js).
  - 🔴 **Crítico:** Total JS $> 650\text{ KB}$ gzip o presencia de módulos no utilizados en el bundle principal.

### PERF-BND-003: Des-acoplamiento Dinámico de `html5-qrcode` en `LeadFormModal.jsx`
- **Métrica / Área:** Carga Perezosa (Lazy Loading) | Reducción de Chunks Críticos
- **Objetivo:** Validar que la biblioteca de lectura de códigos QR (`html5-qrcode`) no se incluya de forma estática dentro del chunk de captura de prospectos (`LeadFormModal-C1koqEst.js`), reduciendo su tamaño de 360 KB a menos de 40 KB.
- **Umbral Objetivo:** Tamaño individual del chunk `LeadFormModal` $\le 50\text{ KB}$ (reducción del 88%).
- **Pasos de Medición:**
  1. Verificar que en `LeadFormModal.jsx:23` se utilice `React.lazy(() => import('./QrScannerModal'))` en lugar de una importación estática en la cabecera.
  2. Compilar el proyecto y revisar la tabla de salida de Rollup para confirmar que `html5-qrcode` forme un chunk independiente cargado exclusivamente al pulsar "Escanear Credencial/QR".
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** `LeadFormModal` pesa $\le 50\text{ KB}$ minificado.
  - 🔴 **Crítico:** `html5-qrcode` se descarga antes de que el usuario decida abrir el escáner.

### PERF-BND-004: Optimización de Activos 3D: Compresión Draco de `Model_Skeleton.glb`
- **Métrica / Área:** Tamaño de Modelos 3D | Ahorro de Egress de Red
- **Objetivo:** Verificar la compresión geométrica mediante Draco o Meshopt del archivo de esqueleto humano (`Model_Skeleton.glb`), reduciendo su volumen de 4.82 MB (5,055,584 bytes) a $\le 1.5\text{ MB}$, previniendo el agotamiento prematuro de la cuota de 2 GB en Supabase.
- **Umbral Objetivo:** Tamaño en disco de `Model_Skeleton.glb` $\le 1.5\text{ MB}$.
- **Pasos de Medición:**
  1. Verificar el tamaño del archivo actual en `public/assets/Model_Skeleton.glb`.
  2. Ejecutar compresión con `gltf-pipeline`:
     ```powershell
     npx gltf-pipeline -i public/assets/Model_Skeleton.glb -o public/assets/Model_Skeleton_draco.glb -d
     ```
  3. Comprobar que `<model-viewer>` soporte la descompresión Draco en tiempo de ejecución sin degradar la fidelidad anatómica de las articulaciones.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** Archivo GLB resultante $\le 1.5\text{ MB}$ con fidelidad visual íntegra.
  - 🟡 **Requiere Atención:** Tamaño entre $1.5\text{ MB}$ y $3.0\text{ MB}$.
  - 🔴 **Crítico:** Modelo $> 3.0\text{ MB}$ sin comprimir (estado previo: 4.82 MB).

---

#### PERF-PWA: Service Worker Workbox, Caching y Resiliencia Offline

### PERF-PWA-001: Auditoría de Service Worker: Eliminación de la Precaché Masiva de 4.13 MB
- **Métrica / Área:** Service Worker Workbox | Ancho de Banda de Primera Visita
- **Objetivo:** Verificar que la directiva `globPatterns` en `vite.config.js:71` no precachee indiscriminadamente bundles pesados diferidos (`pdf.worker.min.js` de 1.08 MB, `model-viewer.min.js` de 913 KB, `pdfGenerator.js` de 427 KB), restringiendo la precaché estrictamente al shell mínimo ($\le 1.2\text{ MB}$).
- **Umbral Objetivo:** Precaché inicial del Service Worker $\le 1.2\text{ MB}$ total.
- **Herramientas:** Inspección de `dist/sw.js` y DevTools Application Tab (Cache Storage).
- **Pasos de Medición:**
  1. Compilar el proyecto e inspeccionar el manifiesto de precaché en `dist/sw.js`:
     ```powershell
     Get-Content dist/sw.js | Select-String -Pattern "precacheAndRoute"
     ```
  2. Abrir la aplicación en un navegador limpio y registrar el volumen de datos descargados por el evento `install` del Service Worker.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** Manifiesto de precaché $\le 1.2\text{ MB}$ (descarga únicamente HTML, CSS base y JS shell).
  - 🔴 **Crítico:** Precaché $> 2.5\text{ MB}$ (estado previo: **4.13 MB**, canibalizando el ancho de banda del usuario).

### PERF-PWA-002: Estrategias de Caché Runtime: Supabase REST API y Media CDN
- **Métrica / Área:** Estrategias de Caché Workbox (`StaleWhileRevalidate` / `CacheFirst`)
- **Objetivo:** Validar la intercepción y cacheo en tiempo de ejecución de las llamadas a la API REST de Supabase (`/rest/v1/productos_catalogo` y `configuracion_kiosco`) mediante `StaleWhileRevalidate`, y de imágenes externas (`media.tynorcatalog.com`) mediante `CacheFirst`, auditando riesgos de respuestas opacas e invalidación de datos obsoletos.
- **Auditoría de Configuración y Riesgos Detectados:**
  - **Ausencia de Rutas en `vite.config.js`:** En la configuración actual de Vite PWA (`vite.config.js:73-135`), las reglas de `runtimeCaching` solo contemplan assets locales (`/assets/`), modelos `.glb` y fuentes de Google. No existe ninguna regla activa que intercepte el dominio de Supabase (`xvrnssesbkzxeusubzes.supabase.co`) ni el Media CDN.
  - **Peligro de Respuestas Opacas (Status 0):** En llamadas cross-origin REST a Supabase, si se configura `cacheableResponse: { statuses: [0, 200] }` por error, almacenar respuestas con estado `0` (opacas sin CORS adecuado) causará una excepción fatal `TypeError: Failed to execute 'json' on 'Response': body stream already read or opaque` al invocar `response.json()`. Las rutas de API REST DEBEN exigir estrictamente `statuses: [200]`.
  - **Invalidación ante Mutaciones Administrativas (Cache-Busting):** Al utilizar `StaleWhileRevalidate`, las mutaciones (`POST`, `PATCH`, `DELETE`) realizadas desde el panel de administración no invalidan la entrada en Cache Storage. En la siguiente recarga, la respuesta vieja puede sobreescribir los cambios del usuario. El plan mandata invalidación explícita mediante borrado de la clave en Cache Storage (`caches.delete(...)`) o despacho de cabeceras `Cache-Control: no-cache` tras cualquier mutación administrativa exitosa.
- **Umbral Objetivo:** Respuestas servidas desde caché en $\le 15\text{ ms}$ en la segunda visita sin conexión o red degradada; coherencia de datos del 100% tras mutaciones de administración.
- **Pasos de Medición:**
  1. Verificar que `vite.config.js` incorpore la regla de runtime para `https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/(productos_catalogo|configuracion_kiosco).*` con `StaleWhileRevalidate` y `statuses: [200]`.
  2. Cargar la aplicación con conexión activa para poblar la caché.
  3. Activar "Disable Network" en Chrome DevTools y verificar que el catálogo cargue instantáneamente desde Service Worker.
  4. Reactivar la red, editar un producto desde el panel de administración y comprobar que la caché del Service Worker se purgue automáticamente, reflejando el cambio de inmediato.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** Rutas interceptadas con éxito (`statuses: [200]`); cero excepciones `TypeError`; invalidación automática de caché al mutar datos en el panel administrativo.
  - 🔴 **Crítico:** Peticiones a Supabase fallan en modo desconectado por falta de regla de interceptación o arrojan excepciones por consumo de respuestas opacas.

### PERF-PWA-003: Resiliencia en Modo 100% Offline (Air-Gapped) y Fallback de Imágenes
- **Métrica / Área:** Disponibilidad Fuera de Línea | Kiosco en Modo Avión
- **Objetivo:** Comprobar que el kiosco permita la navegación completa de los 180+ productos, búsqueda local, apertura de modales de detalle y visualización 3D sin conexión alguna a internet (entorno air-gapped).
- **Umbral Objetivo:** Cero pantallas blancas; fallback a vector SVG (`placeholder-product.svg`) si una imagen personalizada remota no está en caché.
- **Pasos de Medición:**
  1. Desconectar la tarjeta de red del equipo o activar Modo Avión.
  2. Abrir el kiosco en el navegador o como PWA instalada desde el escritorio.
  3. Realizar 20 búsquedas consecutivas por categorías y códigos de producto.
  4. Abrir 10 productos y añadir 5 al carrito de cotización.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** 100% de los productos base se consultan sin fallo gracias a la inclusión estática en `src/data/products.js`; las imágenes no disponibles muestran el placeholder visualmente atractivo sin romper el diseño.
  - 🔴 **Crítico:** Bloqueo de la interfaz o fallo catastrófico por falta de red.

### PERF-PWA-004: Límite de Cuota de LocalStorage (5 MB), Migración a IndexedDB y Gestión de Memoria Blob (`URL.revokeObjectURL`)
- **Métrica / Área:** Cuotas de Almacenamiento en Navegador y Prevención de Fugas OOM
- **Objetivo:** Auditar la persistencia de productos personalizados en `productManager.js:407-448`, documentar la saturación de los 5 MB de `localStorage` al almacenar imágenes en Base64, y definir el protocolo riguroso de migración a `IndexedDB` con liberación estricta de memoria GPU/Heap.
- **Diagnóstico y Protocolo de Migración a IndexedDB:**
  - **Estado Actual:** El código en `src/services/productManager.js` utiliza exclusivamente `localStorage.getItem('tynor_custom_products')`. Guardar 15 a 20 imágenes en Base64 (~200 KB cada una) satura irremediablemente el límite de 5 MB de `localStorage`, disparando `DOMException: QuotaExceededError`.
  - **Arquitectura IndexedDB Requerida:** Migrar a un almacén de objetos asíncrono (`idb` o `indexedDB.open('TynorCatalogDB', 1)`), con almacén `custom_products` que guarde las imágenes como objetos binarios `Blob` nativos (capacidad de cientos de megabytes).
  - **Prevención de Fugas de Memoria en Kioscos 24/7:**
    - Para renderizar Blobs en etiquetas `<img src={...}>`, el sistema debe generar URLs temporales con `URL.createObjectURL(blob)`.
    - ⚠️ **Riesgo Crítico de Fuga de Memoria:** Si estas URLs no son revocadas explícitamente, la GPU y la memoria de proceso del navegador acumulan referencias continuas a texturas gráficas. En un kiosco interactivo operando desatendido 24/7 en exposiciones o clínicas, esto garantiza un fallo por falta de memoria (Out-Of-Memory Crash / pantalla en negro).
    - **Mandato:** Todo componente de tarjeta o modal que genere un Object URL debe liberar obligatoriamente la memoria en su ciclo de desmontaje (`useEffect cleanup`):
      ```javascript
      useEffect(() => {
        const objectUrl = URL.createObjectURL(productBlob);
        setImageSrc(objectUrl);
        return () => {
          URL.revokeObjectURL(objectUrl); // Prevención obligatoria de fuga de memoria
        };
      }, [productBlob]);
      ```
- **Umbral Objetivo:** Persistencia offline de más de 100 productos personalizados con imágenes en alta resolución sin excepción de cuota; cero crecimiento descontrolado de heap en pruebas de ciclo continuo de 2 horas.
- **Pasos de Medición:**
  1. Ejecutar el arnés de simulación de almacenamiento (`tests/stress_simulation.mjs` prueba P3).
  2. Inyectar secuencialmente 50 productos con imágenes binarias de 500 KB cada una en IndexedDB.
  3. Navegar cíclicamente por las tarjetas de producto durante 30 minutos monitoreando la memoria JS Heap en Chrome Task Manager.
  4. Confirmar que las llamadas a `URL.revokeObjectURL` mantienen la memoria retenida estable sin incrementos lineales.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** Persistencia en IndexedDB sin excepciones de cuota; liberación comprobada de Object URLs vía `URL.revokeObjectURL`; uso de memoria RAM estabilizado.
  - 🔴 **Crítico:** Bloqueo de creación de productos por `QuotaExceededError` en `localStorage` o fuga progresiva de memoria (> 200 MB de crecimiento sin liberar) en el renderizado de imágenes personalizadas.

### PERF-PWA-005: Resiliencia y Sincronización de la Cola Offline de Prospectos
- **Métrica / Área:** Sincronización Eventual de Leads | Transacciones Comerciales
- **Objetivo:** Validar que los prospectos capturados durante un corte de red se almacenen en la cola local FIFO (`tynor_pending_leads`) hasta un máximo de 50 elementos, y se sincronicen de manera automática y secuencial con Supabase al restablecerse la conectividad (`window.addEventListener('online')`).
- **Umbral Objetivo:** Tasa de entrega del 100% de los prospectos en cola; cero duplicados; reintentos con respaldo exponencial.
- **Pasos de Medición:**
  1. Desconectar la red.
  2. Enviar 10 formularios de prospectos con datos de prueba válidos.
  3. Verificar que `localStorage.getItem('tynor_pending_leads')` contenga exactamente los 10 registros.
  4. Restablecer la conexión a internet.
  5. Monitorear las peticiones de red hacia `https://xvrnssesbkzxeusubzes.supabase.co/rest/v1/prospectos_comerciales`.
- **Criterios de Aceptación:**
  - 🟢 **Aprobado:** Los 10 prospectos se transmiten exitosamente; la cola local se vacía de forma limpia tras recibir confirmación HTTP 201; no se pierden datos.
  - 🔴 **Crítico:** Pérdida de prospectos al cerrar la pestaña o fallo de sincronización en bucle que bloquee el navegador.

---

#### PERF-STR: Pruebas de Estrés, Concurrencia y Resistencia de Cuotas

### PERF-STR-001: Perfil k6 Línea Base (20 Usuarios Virtuales Concurrentes / 10 en Producción)
- **Métrica / Área:** Concurrencia Normal | Kiosco en Día Promedio
- **Objetivo:** Evaluar la estabilidad del servicio bajo una carga representativa de quioscos simultáneos interactuando con el catálogo, sincronizando configuraciones y consultando productos.
- **Umbral Objetivo:** Latencia p95 $\le 250\text{ ms}$; Tasa de fallos $< 0.01\%$ (`rate<0.0001`).
- **Configuración de Carga y Particionado por Entorno:**
  - **Entorno Staging / Docker Local (`TARGET_ENV=staging`):** 20 Virtual Users (VUs) continuos durante 5 minutos.
  - **Entorno Producción (`TARGET_ENV=production`):** Acotado estrictamente a $\le 10\text{ VUs}$ concurrentes simultáneos hacia Supabase para resguardar el pool de 60 conexiones conforme a la regla del RoE (Sección 3.4).

### PERF-STR-002: Perfil k6 Concurrencia de Congreso (100 Usuarios Virtuales)
- **Métrica / Área:** Carga Alta en Eventos Médicos | Saturación de Borde
- **Objetivo:** Evaluar la respuesta de Vercel CDN y Supabase PostgREST durante picos de asistencia en congresos ortopédicos con 100 usuarios simultáneos realizando búsquedas y filtrados.
- **Umbral Objetivo:** Latencia p95 $\le 800\text{ ms}$; Latencia p99 $\le 1,500\text{ ms}$; Tasa de fallos $< 0.10\%$ (`rate<0.001`).
- **Configuración de Carga y Particionado por Entorno:**
  - **Entorno Staging / Docker Local (`TARGET_ENV=staging`):** Rampa de 0 a 100 VUs en 2 minutos, sostenido por 5 minutos contra PostgREST y API.
  - **Entorno Producción (`TARGET_ENV=production`):** Solo se permite inyectar 100 VUs contra el CDN estático de Vercel (`${BASE_URL}/`); las consultas hacia Supabase se desacoplan o limitan a 10 VUs para evitar degradar el servicio a pacientes y médicos.

### PERF-STR-003: Perfil k6 Estrés Extremo y Avalancha (250 Usuarios Virtuales - Exclusivo Staging)
- **Métrica / Área:** Resistencia Límite y Recuperación ante Caídas
- **Objetivo:** Determinar el punto de degradación del sistema, comportamiento del pooler de conexiones de PostgreSQL (máximo 60 en Supabase Free Tier) y estabilidad del middleware.
- **Umbral Objetivo:** Latencia p95 $\le 1,500\text{ ms}$; Tasa de fallos $< 5.0\%$ (`rate<0.05`); recuperación instantánea al cesar la avalancha.
- **Configuración de Carga y Particionado por Entorno:**
  - **Entorno Staging / Docker Local Exclusivo (`TARGET_ENV=staging`):** Inyección súbita de 250 VUs en 10 segundos, sostenido por 60 segundos.
  - 🛑 **Prohibición Terminante en Producción:** Queda estrictamente vetado lanzar 250 VUs contra la base de datos de producción (`xvrnssesbkzxeusubzes`). De acuerdo con la Ley de Little, 250 VUs generarían ~147 req/s saturando el pool físico de 60 conexiones y provocando una denegación de servicio (DoS) global en los kioscos operativos.

### PERF-STR-004: Monitoreo de Límites de Cuota y Timeouts (10s Vercel & Egress Supabase)
- **Métrica / Área:** Restricciones de Infraestructura Free/Hobby Tier y Timeouts Serverless
- **Objetivo:** Verificar que el endpoint `/api/send-email.js` no supere el timeout crítico de 10 segundos de Vercel al procesar envíos de cotizaciones mediante la desvinculación asíncrona de la sincronización IMAP, y monitorizar el consumo acumulado de egress en Supabase.
- **Umbral Objetivo:** Tiempo total de invocación serverless $\le 3.5\text{ s}$ en el percentil 95 (límite inamovible $< 10.0\text{ s}$); tasa de fallos $< 1.0\%$ (`rate<0.01`).
- **Configuración en k6:** Escenario dedicado `email_timeout` con 5 VUs espaciados por 15 segundos para no violar las cuotas de transporte SMTP.

---

### 4.3 Especificación de Perfiles de Carga y Scripts k6

A continuación se proporciona el script estandarizado en **k6** (`k6-load-test-suite.js`), que implementa de forma nativa la partición por entorno (`TARGET_ENV`), salvaguarda de conexiones a base de datos, umbrales numéricos alineados y prueba de timeout en `/api/send-email.js`:

```javascript
// k6-load-test-suite.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// Selección de escenario y entorno mediante variables de entorno
const scenario = __ENV.K6_SCENARIO || 'baseline';   // baseline | peak | stress | email_timeout
const targetEnv = __ENV.TARGET_ENV || 'production'; // production | staging

const BASE_URL = __ENV.TARGET_URL || 'https://catalogotyn.vercel.app';
const SUPABASE_URL = __ENV.SUPABASE_URL || 'https://xvrnssesbkzxeusubzes.supabase.co';
const ANON_KEY = __ENV.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cm5zc2VzYmt6eGV1c3ViemVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMwNDg2NTgsImV4cCI6MjEwODYyNDY1OH0.Flfpf4NZHP84b5MvDpBDU6cHXkt78dty8GF63RnHy3c';

// 🛑 SALVAGUARDA DE SEGURIDAD OPERATIVA (RoE Sección 3.4)
if (targetEnv === 'production' && scenario === 'stress') {
  throw new Error('[SEGURIDAD ROE] El escenario de estrés de 250 VUs está terminantemente prohibido contra Supabase producción. Use TARGET_ENV=staging.');
}

let stagesConfig = [];
let thresholdsConfig = {};

if (scenario === 'baseline') {
  // En producción se acota a 10 VUs para respetar el límite de 10 conexiones del RoE; en staging corre a 20 VUs
  const maxVus = targetEnv === 'production' ? 10 : 20;
  stagesConfig = [
    { duration: '1m', target: maxVus },
    { duration: '5m', target: maxVus },
    { duration: '1m', target: 0 },
  ];
  thresholdsConfig = {
    http_req_duration: ['p(95)<250'],
    http_req_failed: ['rate<0.0001'], // < 0.01% de fallos
  };
} else if (scenario === 'peak') {
  stagesConfig = [
    { duration: '2m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ];
  thresholdsConfig = {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.001'], // < 0.10% de fallos
  };
} else if (scenario === 'stress') {
  // Exclusivo de Staging / Docker local
  stagesConfig = [
    { duration: '10s', target: 250 },
    { duration: '1m', target: 250 },
    { duration: '20s', target: 10 },
    { duration: '1m', target: 10 },
  ];
  thresholdsConfig = {
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.05'], // < 5.0% de fallos
  };
} else if (scenario === 'email_timeout') {
  // Auditoría específica de timeout de función serverless Vercel (10s max en PERF-STR-004)
  stagesConfig = [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '30s', target: 0 },
  ];
  thresholdsConfig = {
    http_req_duration: ['p(95)<3500'], // <= 3.5s SLA en percentil 95
    http_req_failed: ['rate<0.01'],   // < 1.0% de fallos
  };
}

export const options = {
  stages: stagesConfig,
  thresholds: thresholdsConfig,
};

export default function () {
  const headers = {
    'User-Agent': 'k6-load-testing-agent',
    'X-Audit-Agent': 'TynorKiosk-PerformanceAudit/1.0',
    'Content-Type': 'application/json',
  };

  if (scenario === 'email_timeout') {
    // Prueba controlada sobre /api/send-email.js (PERF-STR-004)
    const payload = JSON.stringify({
      recipientEmail: 'sink-test@tynor.com.mx',
      userName: '[TEST-AUDIT] Doctor QA',
      doctorNotes: 'Auditoría controlada de rendimiento y timeout serverless 10s.',
      pdfBase64: 'JVBERi0xLjQKJcTl8uXrCg==', // Payload PDF sintético mínimo
    });

    const resEmail = http.post(`${BASE_URL}/api/send-email.js`, payload, {
      headers,
      timeout: '12s', // 12s para capturar si se excede el límite de 10s de Vercel
    });

    check(resEmail, {
      'Email API responde <= 10s (sin gateway timeout 504)': (r) => r.status !== 504,
      'Email API status controlado (200 o 400)': (r) => r.status === 200 || r.status === 400,
    });

    sleep(15); // Intervalo de 15s respetando límite de tasa RoE SMTP
    return;
  }

  // 1. Carga de Shell HTML en Vercel CDN Edge
  const resHtml = http.get(`${BASE_URL}/`, { headers });
  check(resHtml, { 'HTML 200 OK': (r) => r.status === 200 });

  // 2. Consulta de Configuración Global en Supabase PostgREST
  // Salvaguarda: En producción solo los primeros 10 VUs realizan consultas a Supabase
  const allowSupabaseCall = (targetEnv !== 'production') || (__VU <= 10);

  if (allowSupabaseCall) {
    const spHeaders = {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'X-Audit-Agent': 'TynorKiosk-PerformanceAudit/1.0',
    };
    const resBranding = http.get(`${SUPABASE_URL}/rest/v1/configuracion_kiosco?id=eq.global&select=*`, { headers: spHeaders });
    check(resBranding, { 'Supabase Branding 200 OK': (r) => r.status === 200 });
  }

  // 3. Simulación de pausa de usuario explorando catálogo
  sleep(1.5);
}
```

**Comandos de ejecución por perfil y entorno:**
```powershell
# Perfil 1: Línea Base en Producción (acotado automáticamente a <= 10 VUs para Supabase)
k6 run -e K6_SCENARIO=baseline -e TARGET_ENV=production -e TARGET_URL=https://catalogotyn.vercel.app k6-load-test-suite.js

# Perfil 2: Concurrencia de Congreso (100 VUs en Staging o Vercel Edge)
k6 run -e K6_SCENARIO=peak -e TARGET_ENV=staging -e TARGET_URL=https://catalogotyn.vercel.app k6-load-test-suite.js

# Perfil 3: Estrés Extremo y Avalancha (250 VUs - EXCLUSIVO Staging / Docker local)
k6 run -e K6_SCENARIO=stress -e TARGET_ENV=staging -e TARGET_URL=http://localhost:3000 -e SUPABASE_URL=http://localhost:54321 k6-load-test-suite.js

# Perfil 4: Validación de Timeout Serverless en /api/send-email.js (PERF-STR-004)
k6 run -e K6_SCENARIO=email_timeout -e TARGET_URL=https://catalogotyn.vercel.app k6-load-test-suite.js
```

---

## 5. Rúbricas de Evaluación y Criterios de Aceptación

### 5.1 Definición de Estados de Dictamen

Cada vector evaluado en este Plan Maestro debe recibir un dictamen unívoco e inapelable clasificado en tres niveles:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        DICTAMEN DE EVALUACIÓN                         │
├─────────────────────┬──────────────────────────────────────────────────┤
│ 🟢 APROBADO         │ Cumple plenamente con los estándares y cuotas.  │
│ 🟡 REQUIERE ATENCIÓN│ Desviación menor; tolerable sin impacto crítico. │
│ 🔴 CRÍTICO          │ Vulnerabilidad severa o fallo que bloquea prod. │
└─────────────────────┴──────────────────────────────────────────────────┘
```

---

### 5.2 Rúbrica Detallada por Dominio Tecnológico

| Dominio Tecnológico | 🟢 Aprobado (Pass) | 🟡 Requiere Atención (Warning) | 🔴 Crítico (Blocker / Fail) |
| :--- | :--- | :--- | :--- |
| **Autenticación (NIP / Admin)** | NIP hasheado con salt; resistencia a fuerza bruta online con bloqueo tras 5 intentos; credenciales no expuestas en el DOM. | Falta de rate limiting estricto en UI pero hash con salt presente; NIP de 4 dígitos sin política forzada de complejidad. | NIP en texto plano; bypass total enviando mutaciones directas a Supabase sin token de administración. |
| **Seguridad de Datos & RLS** | RLS activo en todas las tablas; INSERT-only para prospectos sin SELECT público; anon no puede mutar catálogo ni branding. | RLS activo pero permite lectura anónima de columnas no sensibles; políticas con filtros redundantes. | RLS desactivado o política anon `USING (true)` que permite DELETE/UPDATE de productos o robo masivo de prospectos. |
| **Inyecciones & XSS** | Todos los inputs saneados; escape HTML en correos; jsPDF sin vulnerabilidades de inyección; cero ejecución de payloads. | Sanitización funcional pero basada en regex permisivo; CSP permisivo (`unsafe-eval` activo). | XSS reflejado o almacenado ejecutable en catálogo; inyección HTML en plantillas de correo que permite phishing. |
| **Configuración HTTP & CSP** | HSTS preload activo; XFO DENY; XCTO nosniff; CSP estricto sin fuentes externas no verificadas; cero secretos en repo. | CSP contiene `'unsafe-inline'` o `'unsafe-eval'` por compatibilidad legacy; falta etiqueta meta en build PWA. | Falta de HSTS; clickjacking permitido; secretos de servicio de Vercel o Supabase filtrados en el código. |
| **API Serverless & SMTP** | CORS restringido a dominios oficiales; SSRF bloqueado; CRLF mitigado; rate limit 15 req/min efectivo; TLS obligatorio. | Rate limit en memoria reiniciable en cold-start; IMAP con `rejectUnauthorized: false` documentado. | SSRF alcanzable hacia metadatos (169.254.169.254); relay abierto de spam; inyección CRLF en cabeceras de correo. |
| **Core Web Vitals** | LCP $\le 2.5\text{ s}$, CLS $\le 0.10$, INP $\le 200\text{ ms}$ en condiciones móviles y desktop 4G. | LCP entre $2.5\text{ s}$ y $4.0\text{ s}$; CLS entre $0.10$ y $0.25$; INP entre $200\text{ ms}$ y $500\text{ ms}$. | LCP $> 4.0\text{ s}$; CLS $> 0.25$; INP $> 500\text{ ms}$; congelamiento de la interfaz táctil. |
| **Presupuesto de Bundles** | Initial JS $\le 200\text{ KB}$ gzip; CSS $\le 50\text{ KB}$ gzip; Total JS $\le 500\text{ KB}$ gzip. | Initial JS $200-250\text{ KB}$ gzip; Total JS $500-650\text{ KB}$ gzip por inclusión de visores PDF/3D. | Initial JS $> 250\text{ KB}$ gzip; Total JS $> 650\text{ KB}$ gzip; CSS $> 80\text{ KB}$ gzip. |
| **PWA & Offline Resilience** | Catálogo 100% operativo sin conexión; Workbox cachea activos; cola offline preserva leads hasta 50 registros. | La navegación básica funciona pero faltan imágenes WebP secundarias; cola offline sin alerta al usuario. | Pantalla blanca al cortar la red; pérdida inmediata de cotizaciones o leads en modo offline. |
| **Estrés & Concurrencia** | p95 $\le 800\text{ ms}$, p99 $\le 1,500\text{ ms}$, error rate $< 0.1\%$ a 50 VUs continuos. | p95 entre $800\text{ ms}$ y $1,500\text{ ms}$; error rate entre $0.1\%$ y $1.0\%$ a 50 VUs; latencias elevadas en Supabase. | Error rate $\ge 1.0\%$; saturación del pool de conexiones; caída de la función serverless (504 Gateway Timeout). |

---

### 5.3 Criterios de Aprobación Global para Pase a Producción

Para emitir el **Dictamen Favorable de Liberación a Producción**, el sistema debe cumplir simultáneamente:
1. **Cero hallazgos en estado 🔴 Crítico** en cualquier vector de seguridad o rendimiento.
2. **Menos de 3 hallazgos en estado 🟡 Requiere Atención**, siempre que cuenten con un plan de mitigación documentado y fecha límite de remediación.
3. **Aprobación formal firmada** por el Ingeniero de Seguridad (AppSec Lead) y el Arquitecto de Software en la Matriz RACI.

---

## 6. Cronograma, Herramientas y Matriz RACI

### 6.1 Catálogo Unificado de Herramientas de Prueba

| Herramienta | Tipo | Licencia | Entorno de Ejecución | Rol Responsable |
| :--- | :--- | :--- | :--- | :--- |
| **Semgrep OSS** | SAST | LGPL-2.1 | CI/CD / Terminal Local | Ingeniero de Seguridad |
| **ESLint Security** | SAST Linter | MIT | Node.js Local | Desarrollador Frontend |
| **Trivy** | Secret Scanner | Apache 2.0 | Terminal Local | Ingeniero de Seguridad |
| **OWASP ZAP** | DAST Scanner | Apache 2.0 | Docker / Staging | Ingeniero de Seguridad |
| **Google Lighthouse** | CWV / Auditoría | Apache 2.0 | Chromium DevTools | Especialista en QA / Rendimiento |
| **k6 by Grafana** | Carga y Concurrencia | AGPL-3.0 | CLI / Servidor de Pruebas | Especialista en QA / Rendimiento |
| **Playwright** | E2E & Seguridad | Apache 2.0 | Node.js Headless | Automatizador de Pruebas QA |
| **PostgREST / cURL** | Sondas API | Open Source | PowerShell / Bash | Todos los roles técnicos |

---

### 6.2 Fases y Cronograma de Ejecución

```mermaid
gantt
    title Cronograma de Ejecución del Plan Maestro de Pruebas
    dateFormat  YYYY-MM-DD
    section Fase 1: Análisis Estático
    Auditoría SAST y Dependencias (npm audit, Semgrep)    :a1, 2026-11-06, 2d
    Escaneo de Secretos y Tokens (Trivy, Git)             :a2, 2026-11-07, 1d
    section Fase 2: Auditoría Dinámica
    Pruebas DAST y Cabeceras HTTP (ZAP, cURL, CSP)        :b1, 2026-11-08, 2d
    Auditoría RLS Supabase y Base de Datos (Staging)      :b2, 2026-11-09, 3d
    Pruebas Criptográficas NIP y API SMTP                 :b3, 2026-11-10, 2d
    section Fase 3: Pruebas de Rendimiento
    Medición Core Web Vitals y Rendimiento Hilo Principal :c1, 2026-11-12, 2d
    Auditoría de Bundles Vite y Compresión Draco 3D       :c2, 2026-11-13, 2d
    Pruebas PWA Workbox y Resiliencia Offline (Air-gapped):c3, 2026-11-14, 2d
    section Fase 4: Carga y Estrés
    Ejecución de Perfiles k6 (Baseline, Peak, Stress)     :d1, 2026-11-16, 3d
    section Fase 5: Validación y Cierre
    Verificación Controlada en Producción (RoE)           :e1, 2026-11-19, 1d
    Consolidación de Informes y Dictamen Final            :e2, 2026-11-20, 1d
```

---

### 6.3 Matriz de Asignación de Responsabilidades (RACI)

La matriz RACI define la gobernanza del plan de pruebas:
* **R (Responsible):** Quien ejecuta la prueba o remediación técnica.
* **A (Accountable):** Quien aprueba y rinde cuentas por el resultado final.
* **C (Consulted):** Quien provee contexto técnico o criterios de diseño.
* **I (Informed):** Quien debe ser notificado del estado o incidentes.

| Actividad / Hito Técnico | Arquitecto de Software | Especialista QA / Rendimiento | Ingeniero AppSec / Seguridad | Administrador Supabase / DB | Product Owner / Stakeholder |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Definición de Políticas CSP y Cabeceras** | **A** | **I** | **R** | **I** | **I** |
| **Auditoría de RLS y Permisos en Supabase** | **C** | **I** | **R** | **A** | **I** |
| **Pruebas de Criptografía y Fuerza Bruta NIP** | **C** | **I** | **R / A** | **I** | **I** |
| **Mitigación y Pruebas en API SMTP Serverless** | **A** | **I** | **R** | **I** | **I** |
| **Medición de Core Web Vitals (LCP, CLS, INP)** | **C** | **R / A** | **I** | **I** | **I** |
| **Optimización de Bundles Vite y Draco 3D** | **R / A** | **R** | **I** | **I** | **I** |
| **Pruebas de Resiliencia PWA Offline-First** | **C** | **R / A** | **I** | **I** | **I** |
| **Ejecución de Perfiles de Estrés k6** | **C** | **R / A** | **C** | **C** | **I** |
| **Ejecución de Pruebas en Producción (RoE)** | **A** | **R** | **R** | **A** | **I** |
| **Emisión del Dictamen Final de Liberación** | **A** | **C** | **A** | **C** | **I** |

---

### Fin del Documento Maestro
*Plan Maestro de Pruebas de Seguridad y Rendimiento — CatalogoTyn v1.0*  
*Aprobado por Ingeniería de Calidad y Ciberseguridad.*
