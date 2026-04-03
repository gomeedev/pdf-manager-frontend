# PDF Manager Frontend

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-%23000000.svg?logo=supabase&logoColor=3ECF8E)](https://supabase.com/)
[![NPM](https://img.shields.io/badge/npm-10.x-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/)

## Descripción del Proyecto

Interfaz web moderna construida con React y TypeScript para **PDF Manager**, plataforma SaaS de gestión inteligente de documentos PDF. El cliente expone dos modos de operación: 
1. interfaz ergonómica para operaciones directas (fusión, división, compresión, eliminación de páginas).
2. chat interactivo con agente ReAct que interpreta las instrucciones en lenguaje natural y orquesta múltiples operaciones en secuencia.

## Stack Técnico

- **Lenguaje:** TypeScript 5.7.2
- **Framework:** React 19.0.0
- **Build Tool:** Vite 6.2.0
- **Gestor de paquetes:** npm
- **Estilos:** Tailwind CSS 3.4.17
- **Componentes UI:** Shadcn/ui + Radix UI
- **Animaciones:** Framer Motion 12.6.3 + GSAP 3.12.7
- **HTTP Client:** Axios 1.8.4
- **Enrutamiento:** React Router DOM 7.4.1
- **Autenticación & Backend:** Supabase JS SDK 2.49.4
- **Markdown:** React Markdown 10.1.0 + Remark GFM

## Arquitectura

El frontend implementa una arquitectura en capas que separa claramente las responsabilidades de presentación, lógica de negocio y comunicación con servicios externos. Este diseño facilita mantenibilidad, testabilidad y escalabilidad.

**API Layer (`src/api/`):** Abstracción de todas las llamadas HTTP al backend mediante clientes Axios especializados. Incluye interceptores automáticos que inyectan el JWT en cada request. Encapsula los endpoints de operaciones PDF, autenticación y agente.

**Pages Layer (`src/pages/`):** Componentes de nivel superior que representan vistas completas (Landing, Dashboard, Agent, Auth). Cada página es responsable de orquestar hooks, contextos y componentes específicos de su funcionalidad.

**Components Layer (`src/components/`):** Componentes reutilizables organizados por dominio. La subcapa `pdf/` contiene lógica visual para operaciones (MergeTool, SplitTool, etc.). La subcapa `animations/` gestiona transiciones y efectos visuales. La subcapa `ui/` proporciona primitivos accesibles (Button, Input, Label). La subcapa `layout/` maneja enrutamiento protegido y estructura general.

**State Management (`src/context/`, `src/hooks/`):** AuthContext centraliza sesión y tokens globales. Custom hooks (useAuth, usePDFs, useOperations, useAgent) procesan lógica compleja de estado y efectos secundarios, exponiendo una API limpia para componentes consumidores.

**Client Layer (`src/lib/`):** Singletons como supabaseClient (instancia reutilizable del SDK de Supabase) y funciones utilitarias compartidas. Garantiza que la sesión de Supabase permanezca consistente en toda la aplicación.

**Styling (`index.css`, `tailwind.config.js`):** Configuración global de Tailwind. Paleta de colores, tipografía y valores de espaciado se definen aquí. Evita estilos inline; toda personalización sucede vía clases de Tailwind o CSS modules.

## Instalación y Configuración

### Requisitos previos
- Node.js 18+ con npm
- Acceso a variables de entorno Supabase
- URL base del backend FastAPI (`http://127.0.0.1:8000/api/v1` en desarrollo)

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/gomeedev/pdf-manager-frontend.git
cd pdf-manager-frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno. Crear archivo `.env.local` en la raíz:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

4. Iniciar servidor de desarrollo:
```bash
npm run dev
```

Acceder a http://localhost:5173

### Comandos principales

```bash
npm run dev         # Desarrollo con hot reload
npm run build       # Compilación para producción (TypeScript + Vite)
npm run lint        # Ejecutar ESLint
npm run preview     # Previsualizar build sin servir
```

## Flujos de Aplicación

### Autenticación y Sesión

El cliente integra Supabase Auth para gestionar usuarios. El flujo es:

1. Usuario accede a `/login` o `/register`
2. Supabase genera tokens JWT (access token + refresh token)
3. Access token se almacena en `sessionStorage` y en `AuthContext` (sesión global)
4. Refresh token se maneja automáticamente por Supabase
5. En cada request HTTP al backend, se inyecta el token: `Authorization: Bearer <token>`
6. FastAPI valida el token y lo usa para inicializar el cliente Supabase con el contexto del usuario (RLS)

La sesión persiste durante la ventana del navegador. Al cerrar sesión, se borra el token y se redirige al login.

### Operaciones PDF (Modo Directo)

El usuario interactúa directamente con herramientas visuales en `/dashboard/operations`. El flujo de una operación típica (ej: merge):

1. Usuario selecciona 2+ PDFs del listado en `/dashboard`
2. Navega a `/dashboard/operations` → sección Merge
3. Interfaz MergeTool permite reordenar PDFs (drag & drop)
4. Click en "Merge" → frontend envía POST a `/api/v1/pdf-ops/merge` con `file_ids[]` y `output_filename`
5. Backend descarga archivos del Storage, fusiona, sube resultado
6. Response incluye metadatos del nuevo PDF (id, filename, size, created_at)
7. Frontend redirige a `/dashboard` con AnimatedRoutes
8. Nuevo PDF aparece automáticamente en la galería (hook usePDFs refetch)

Cada operación (split, compress, remove-pages) sigue el mismo patrón pero con diferentes parámetros.

### Agente ReAct (Modo Conversacional)

El usuario accede a `/dashboard/agent` y conversa en lenguaje natural. El ciclo es:

1. Usuario escribe instrucción: "Fusiona todos mis PDFs y comprime el resultado"
2. Frontend captura input, limpia, envía POST a `/api/v1/agent/chat` con:
   - `user_message`: texto del usuario
   - `messages_history`: conversación anterior (si existe)
3. Backend agente ReAct inicia ciclo de Reasoning-Acting-Observing (máx 5 iteraciones):
   - **Reason:** Analiza el mensaje y contexto histórico
   - **Act:** Selecciona herramienta (list_pdfs, merge_pdfs, compress_pdf, etc.) y parámetros
   - **Observe:** Ejecuta herramienta, recibe resultado, decide si reintentar o responder
4. Backend retorna respuesta final en formato Markdown (puede incluir tablas, código, etc.)
5. Frontend renderiza con React Markdown + Remark GFM (soporte GFM completo)
6. Historial se actualiza en estado local (AuthContext/AgentContext)

El historial es stateless: cliente gestiona toda la conversación y envía completo en cada request.