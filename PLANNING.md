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

### Ciclo 4 — Operaciones directas
- UI para merge (selección múltiple), split (selector de páginas), compress, remove-pages
- Feedback visual durante el proceso (loading states, toasts)
- Resultado: nuevo PDF descargable
- Rama: `feature/ciclo-4-operaciones`

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

## Estado Actual

- [ ] Recibir confirmación de información externa requerida
- [ ] Ejecutar Ciclo 1: Setup
- [ ] Ejecutar Ciclo 2: Auth
- [ ] Ejecutar Ciclo 3: Dashboard
- [ ] Ejecutar Ciclo 4: Operaciones
- [ ] Ejecutar Ciclo 5: Agente IA
