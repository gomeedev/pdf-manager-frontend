# PLANNING.md — PDF Manager Frontend

> Filosofía: **Renault 4** — pequeño, completo y robusto desde el primer ciclo. Sin deuda técnica intencional.

---

## Visión del Producto

Frontend de una aplicación web premium para gestión inteligente de PDFs. El usuario se autentica, sube sus documentos y conversa con un agente de IA en lenguaje natural para ejecutar operaciones (merge, split, compress, eliminar páginas). La experiencia visual debe sentirse como un producto SaaS de primer nivel, no un template genérico.

---

## Stack Técnico Confirmado

| Categoría | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Estilos | Tailwind CSS v3 |
| Componentes base | Shadcn/ui |
| Animaciones | Framer Motion |
| Efectos avanzados | GSAP |
| HTTP Client | Axios |
| Auth + DB | @supabase/supabase-js |
| Estado global | React Context API |
| Routing | React Router DOM v6 |

---

## Arquitectura de Carpetas

```
src/
├── api/              → funciones axios hacia FastAPI (/api/v1)
│   ├── auth.ts       → no se usa (auth es 100% Supabase)
│   ├── pdfs.ts       → upload, list, delete
│   ├── pdfOps.ts     → merge, split, compress, remove-pages
│   └── agent.ts      → chat con el agente ReAct
│
├── components/       → componentes reutilizables UI
│   ├── ui/           → shadcn/ui wrappers
│   ├── layout/       → Navbar, Sidebar, Shell
│   ├── pdf/          → PDFCard, PDFList, UploadDropzone
│   ├── chat/         → ChatWindow, MessageBubble, TypingIndicator
│   └── animations/   → wrappers de Framer Motion (FadeIn, SlideUp, etc)
│
├── pages/
│   ├── LandingPage.tsx     → hero, CTA, features
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx   → lista PDFs + upload
│   ├── OperationsPage.tsx  → merge, split, compress, remove-pages
│   └── AgentPage.tsx       → chat con IA
│
├── hooks/
│   ├── useAuth.ts          → wrapper del contexto de auth
│   ├── usePDFs.ts          → lista, upload, delete usando Supabase JS
│   └── useAgent.ts         → chat state + history
│
├── context/
│   └── AuthContext.tsx     → sesión global, token, user
│
├── lib/
│   └── supabaseClient.ts   → instancia singleton de Supabase
│
├── utils/
│   ├── constants.ts        → API_BASE_URL, bucket name, etc.
│   └── helpers.ts          → formatters, validators
│
└── assets/                 → íconos SVG, imágenes
```

---

## Ciclos de Trabajo

### Ciclo 1 — Configuración base ✅ (pendiente de ejecutar)
- Inicializar proyecto Vite + React + TypeScript
- Instalar y configurar Tailwind CSS v3
- Instalar y configurar Shadcn/ui
- Instalar Framer Motion, GSAP, Axios, React Router DOM, Supabase JS
- Crear estructura de carpetas
- Setup del cliente Supabase
- Rama: `feature/ciclo-1-setup`

### Ciclo 2 — Auth
- AuthContext con Supabase (login, register, logout, session persistence)
- Páginas: Login, Register
- Rutas protegidas (PrivateRoute)
- Interceptor de Axios para inyectar JWT en `Authorization: Bearer`
- Rama: `feature/ciclo-2-auth`

### Ciclo 3 — Dashboard & PDFs
- Listado de PDFs desde Supabase Table `pdf_files` con RLS
- Upload con drag-and-drop (Dropzone → POST /pdf-ops/upload)
- Eliminar PDFs
- Generar URLs de descarga desde Supabase Storage
- Animaciones Framer Motion en la lista
- Rama: `feature/ciclo-3-dashboard`

### Ciclo 4 — Operaciones directas + Correcciones + Mejoras 🔧
**Status:** EN ITERACIÓN - Sec. Estricto (no commits hasta aprobación)

#### 🐛 BUGs a Corregir
1. **Merge PDF** — No redirige ni descarga tras éxito (muestra solo toast)
2. **Split/Remove PDF** — Pantalla blanca en `/dashboard/operations`, requiere refresh manual
   - **DECISION REQUERIDA:** ¿Cuál eliminar? ¿Split o Remove Pages?

#### ✨ Mejoras a Implementar
1. **PDF Preview Modal Global** — Disponible en cualquier módulo (modal superpuesto, cierre sin pérdida de contexto)
2. **Preview antes de upload** — Ver PDF en `FileSelector` / `UploadDropzone` antes de subir
3. **Preview durante merge** — Vista previa dinámica del documento combinado mientras se agregan archivos
4. **Drag & Drop en gestión** — Arrastrar PDFs en merge, split, remove
5. **Ver peso de PDFs** — Mostrar tamaño en lista, cards, operaciones
6. **Landing Page Sumergida** — Partículas dinámicas (1000-5000), interacción con cursor, animaciones scroll-triggered

**Rama:** `feature/ciclo-4-fixes-improvements`

### Ciclo 5 — Agente IA
- Chat interface con historial persistente en state
- Re-envío del `history` completo en cada turno
- Feedback visual: typing indicator, tool-call visualization
- Rama: `feature/ciclo-5-agente`

---

## Integración con la API (FastAPI)

### Base URL
- **Local:** `http://127.0.0.1:8000/api/v1`
- **Producción:** ⚠️ PENDIENTE (ver sección de información requerida)

### Autenticación
Cada request a FastAPI lleva:
```http
Authorization: Bearer <supabase_access_token>
```
Se inyecta via interceptor de Axios, usando el token de la sesión activa de Supabase.

### Endpoints mapeados

| Operación | Método | Ruta |
|---|---|---|
| Upload PDF | POST | `/pdf-ops/upload` (multipart/form-data, campo `file`) |
| Merge | POST | `/pdf-ops/merge` |
| Split | POST | `/pdf-ops/split` |
| Remove Pages | POST | `/pdf-ops/remove-pages` |
| Compress | POST | `/pdf-ops/compress` |
| Agent Chat | POST | `/agent/chat` |

### Supabase (directo desde cliente)
| Operación | Método |
|---|---|
| Listar PDFs | SELECT * FROM `pdf_files` (RLS filtra por `user_id`) |
| URL de descarga | `supabase.storage.from('pdf-files').getPublicUrl(path)` |

---

## Decisiones de Diseño (a confirmar)

### Paleta de Colores
Propuesta base (sujeta a aprobación):
- **Background primario:** `#0A0A0F` (casi negro, azul muy oscuro)
- **Superficie:** `#12121A`
- **Accent primario:** `#6C63FF` (violeta eléctrico)
- **Accent secundario:** `#00D9FF` (cian neón)
- **Texto primario:** `#F5F5FA`
- **Texto secundario:** `#8888AA`

> Busca una estética "dark SaaS premium" con destellos de neón. Similar a Linear, Raycast o Vercel.

### Tipografía
- **Fuente principal:** `Inter` (Google Fonts)
- **Fuente monoespaciada:** `JetBrains Mono` (para mensajes del agente IA)

### Nombre del Producto (en la UI)
Propuesta: *PDF Manager*
> ⚠️ Esto requiere tu confirmación.

---

## 🔧 Información Externa Requerida

Antes de ejecutar cualquier ciclo de código, necesito confirmación de:

### 1. Variables de Entorno (`.env`)

```env
# Supabase — REQUERIDO
VITE_SUPABASE_URL=???
VITE_SUPABASE_ANON_KEY=???

# API Backend
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
VITE_API_BASE_URL_PROD=??? # URL de producción cuando exista
```

**¿Puedes proveer los valores de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`?**
Estos los encuentras en el panel de Supabase → Settings → API.

### 2. URL de la API en Producción
¿Existe ya un entorno de producción del backend? Si no, confirmar que usamos solo `http://127.0.0.1:8000` por ahora.

### 3. Nombre del Producto
¿Cómo quieres llamar la app en la interfaz? (logo, título de página, etc.)
Opciones propuestas: **PDFFlow**, **NovaPDF**, otro que prefieras.

### 4. Paleta de Colores
¿Apruebas la propuesta "dark SaaS neón" (violeta + cian sobre fondo casi negro)?
¿O tienes una dirección visual diferente? (puede ser: minimalista blanco, azul corporativo, verde matrix, etc.)

### 5. Supabase Storage — Bucket Público o Privado
El contexto dice que el bucket `pdf-files` existe. ¿Está configurado como **público** (para URLs directas) o **privado** (requiere signed URLs de corta duración)?
Esto afecta cómo se generan los links de descarga.

### 6. Confirm Delete Endpoint
El contexto menciona que en el "Ciclo 5 de Hardening del backend" se implementó un `DELETE` endpoint. ¿Existe ya?
Si existe, ¿cuál es la ruta exacta? Propuesta estándar: `DELETE /pdf-ops/{file_id}` o `DELETE /pdfs/{file_id}`.

---

## Flujo de Git Comprometido

```
main          ← producción estable
  └── develop ← integración
        └── feature/ciclo-N-nombre  ← trabajo activo
```

Tu rol: crear el PR una vez que yo haga push y te avise.
Mi flujo: push feature → te aviso → tú mergeas → yo hago pull de develop → siguiente ciclo.

---

---

## 🔴 CICLO 4 — Detalles de BUGs y Mejoras

### 🐛 BUG #1: Merge en PDF — Sin redirección ni descarga
**Descripción:** 
- Usuario mergea archivos → muestra toast "Files merged successfully! View in Dashboard"
- El merge SÍ funciona (archivo se crea en backend)
- Pero la UX está rota: sin redirección, sin descarga automática

**Archivo(s) a revisar:** `src/components/pdf/MergeTool.tsx`

**Problema:** Falta implementar el flujo post-merge (descarga y/o redirección)

---

### 🐛 BUG #2: Split y Remove PDF — Pantalla blanca + sin diferenciación
**Descripción:**
- Al hacer clic en split o remove → URL va a `http://localhost:5173/dashboard/operations` (blanca)
- Requiere refresh manual para ver los cambios
- Las dos features visualmente no se diferencian (ambas tienen UI similar)

**Archivo(s) a revisar:** 
- `src/pages/OperationsPage.tsx`
- `src/components/pdf/SplitTool.tsx`
- `src/components/pdf/RemovePagesTool.tsx`

**Problema:** Pantalla blanca sugiere `OperationsPage` no renderiza correctamente. Split y Remove muy similares.

**SUB-DECISIÓN:** ¿Cuál de las dos eliminar? (split O remove-pages)

---

### ✨ MEJORA #1: PDF Preview Modal Global
**Scope:** Disponibilidad en cualquier módulo que gestione PDFs

**Acceptance Criteria:**
1. Opción de previsualización accesible en cada PDF listado/cargado
2. Vista previa inicial (miniatura o primera página)
3. Modal superpuesto al hacer clic (sin cambiar de pestaña)
4. Visualización en detalle del PDF dentro del modal
5. Botón X para cerrar sin perder contexto
6. Persistencia de scroll position y estado previo
7. Manejo de errores (PDF corrupto, no cargable)
8. Indicador de carga mientras se renderiza
9. Responsive (desktop, tablet, mobile)

**Componente a crear:** `src/components/pdf/PDFPreviewModal.tsx`

**Integración:** 
- `PDFList.tsx` → agregar botón preview en cada card
- `PDFCard.tsx` → agregar icono preview

---

### ✨ MEJORA #2: Preview antes de upload
**Scope:** Componentes `FileSelector.tsx` y `UploadDropzone.tsx`

**Requisito:** 
- Usuario arrastra PDF o selecciona archivo
- Puede ver preview (miniatura/primer página) antes de hacer upload
- Reutilizar modal del MEJORA #1

**Localizaciones:**
- `src/components/pdf/FileSelector.tsx`
- `src/components/pdf/UploadDropzone.tsx`

---

### ✨ MEJORA #3: Preview durante merge
**Scope:** `MergeTool.tsx` — vista previa dinámica mientras se agregan archivos

**Requisito:**
- A medida que el usuario agrega PDFs al merge
- Mostrar vista previa del documento combinado (thumbnails en orden)
- Permitir reordenar antes de mergear
- Validar orden y contenido

**Pregunta abierta:** ¿El backend soporta `/api/v1/pdf-ops/preview-merge`? Si no, usar preview local (thumbnails).

---

### ✨ MEJORA #4: Drag & Drop en gestión de PDFs
**Scope:** Merge, Split, Remove — permitir reordenar arrastrando

**Funcionalidades:**
- Reordenar PDFs en merge usando drag & drop
- Drag & drop para seleccionar páginas en split/remove
- Feedback visual durante arrastre (hover, drop zone highlight)

**Componentes a actualizar:**
- `src/components/pdf/MergeTool.tsx`
- `src/components/pdf/RemovePagesTool.tsx`
- `src/components/pdf/SplitTool.tsx`

---

### ✨ MEJORA #5: Ver peso de los PDFs
**Scope:** Global en toda la UI

**Requisito:** Mostrar tamaño humanizado (2.5 MB, 150 KB, etc.) en:
- Lista de PDFs (`PDFList.tsx`)
- Cards de PDF (`PDFCard.tsx`)
- Modal de preview
- Operaciones (merge, split, remove, compress)

**Pregunta abierta:** ¿De dónde extraer el tamaño?
- Backend devuelve en respuesta de upload/list
- Calcular en frontend desde objeto `File`
- Consultar de Supabase (`pdf_files` table)
- Otro

---

### ✨ MEJORA #6: Landing Page Sumergida
**Scope:** `LandingPage.tsx` — experiencia inmersiva e interactiva

**Requisitos (Acceptance Criteria):**
1. Experiencia inmersiva: componentes cargan dinámicamente en scroll
2. Sistema de partículas: 1000-5000 partículas reaccionan al cursor como imán
3. Rendimiento: animaciones fluidas sin bloqueos perceptibles
4. Responsive: adaptarse a desktop/tablet/mobile (o degradarse controladamente)
5. Efectos adicionales: scroll-triggered animations, hover effects, transiciones suaves

**Componente a crear/actualizar:**
- `src/components/animations/Particles.tsx` (si no existe)
- `src/pages/LandingPage.tsx` (integración)

---

## 🔧 Información Externa Requerida (BLOQUEADOR)

**Esperando respuestas a estas preguntas ANTES de iniciar implementación:**

### ✅ Decisión 1: NO eliminar features (Bug #2)
**Resultado:** Mantener AMBAS: Split Y Remove Pages (para después evaluar)

---

### ✅ Decisión 2: Estrategia de Merge (Bug #1)
**Resultado:** Solo mostrar mensaje de éxito + opción de descarga (nada automático)

---

### ✅ Decisión 3: Backend preview durante merge (Mejora #3)
**Resultado:** Implementar lógica en frontend (sin endpoint backend)

---

### ✅ Decisión 4: Reordenamiento en merge (Mejora #4)
**Resultado:** Ordenamiento actual está OK, mantener lógica existente (usuario puede reordenar a su gusto)

---

### ✅ Decisión 5: Fuente de tamaño de archivos (Mejora #5)
**Resultado:** Intentar forma segura (explorar backend response primero, luego frontend fallback)

---

### ✅ Decisión 6: Límite de partículas (Mejora #6)
**Resultado:** Optimizar con GSAP + FramerMotion (sin límite estricto, rendimiento-first)

---

### ✅ Decisión 7: Paleta landing (Mejora #6)
**Resultado:** Usar paleta actual del dashboard + gradientes futuristas/burbuja
**⚠️ IMPORTANTE:** NO cambiar paleta de ningún otro lugar del app

---

## 📅 Plan de Ejecución (Secuencial)

### Fase 0: Validación (⏳ BLOQUEADOR)
1. Esperar respuestas a las 7 preguntas
2. Documentar decisiones aquí

### Fase 1: Correcciones de BUGs (2 tareas)
1. **Bug #1** — Implementar descarga/redirección post-merge
2. **Bug #2** — Reparar pantalla blanca + eliminar feature duplicada

### Fase 2: Mejoras (6 tareas)
3. **Mejora #1** — PDF Preview Modal reutilizable
4. **Mejora #2** — Preview en upload (integrar con #1)
5. **Mejora #3** — Preview en merge (integrar con #1)
6. **Mejora #4** — Drag & Drop en operaciones
7. **Mejora #5** — Mostrar peso de PDFs
8. **Mejora #6** — Landing Page sumergida con partículas

### Workflow por cada tarea
1. ✅ Explorar código actual e identificar cambios
2. ✅ Desarrollar en rama `feature/ciclo-4-fixes-improvements`
3. ✅ Hacer push a origin
4. ⚠️ **NO hacer commits** hasta aprobación
5. ✅ Solicitar validación (tú revisas en frontend)
6. ✅ Iterar si hay feedback
7. ✅ Hacer commit convencional cuando APRUEBES
8. ✅ Tú haces PR, merge, y yo hago pull de develop

---

## Estado Actual

- [x] ✅ **DESBLOQUEADO:** Todas las decisiones confirmadas
- [ ] ⏳ **FASE 1:** Corregir Bug #1 + Bug #2 (secuencial de golpe)
- [ ] **FASE 2:** Mejora #1 (Preview Modal Global)
- [ ] **FASE 2:** Mejora #2 (Preview antes de upload)
- [ ] **FASE 2:** Mejora #3 (Preview durante merge)
- [ ] **FASE 2:** Mejora #4 (Drag & Drop)
- [ ] **FASE 2:** Mejora #5 (Ver peso de PDFs)
- [ ] **FASE 2:** Mejora #6 (Landing Page sumergida)
- [ ] Hacer commits + push
- [ ] Ciclo 5: Agente IA
