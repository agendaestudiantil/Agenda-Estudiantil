# 📚 Agenda Estudiantil Inteligente y Motivacional

> Aplicación web progresiva (PWA) para que estudiantes organicen sus tareas, prioricen actividades de forma automática, reciban recordatorios y se mantengan motivados mediante gamificación.

🔗 **Demo en vivo:** [agenda-inteligente-bethel.vercel.app](https://agenda-inteligente-bethel.vercel.app)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)

---

## 🎯 ¿Qué es este proyecto?

**Agenda Estudiantil Inteligente y Motivacional** es una aplicación pensada para estudiantes que necesitan organizar su vida académica de forma sencilla y con acompañamiento emocional. A diferencia de una agenda tradicional, esta app:

- **Prioriza las tareas automáticamente** según su urgencia e importancia.
- **Motiva al estudiante** con mensajes diarios y un sistema de puntos y rachas.
- **Recuerda las entregas** antes de que se venzan.
- **Funciona en cualquier dispositivo** (celular, tablet o computador) e incluso se puede instalar como app.

---

## ✨ Funcionalidades

### Disponibles
- 🏠 **Inicio (Dashboard):** próximas tareas, mini calendario y mensaje motivacional del día.
- 📖 **Mis Tareas:** lista de tareas con filtros (Todas, Pendientes, En progreso, Completadas) y priorización automática.
- 📅 **Calendario:** vista mensual interactiva con los eventos y tareas de cada día.
- ➕ **Agregar:** creación de Tareas, Eventos, Notas, Metas Personales y Recordatorios.
- 💬 **Mensajes:** chat entre estudiantes con burbujas de conversación.
- 👤 **Perfil:** datos personales, estadísticas de puntos y rachas, y ajustes.
- 🎯 **Priorización inteligente:** algoritmo que ordena las tareas por urgencia e importancia.
- 💪 **Mensajes motivacionales:** frases de ánimo que rotan cada día.

### En desarrollo (ver [ROADMAP.md](./ROADMAP.md))
- 🔐 Autenticación real y persistencia con Supabase.
- 🔔 Notificaciones push y recordatorios programados.
- 🏆 Sistema completo de gamificación (insignias, niveles).
- 📲 Modo offline y experiencia PWA instalable.

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | [React 19](https://react.dev/) |
| Lenguaje | [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com/) |
| Iconos | [Lucide React](https://lucide.dev/) |
| Manejo de fechas | [date-fns](https://date-fns.org/) |
| Enrutamiento | [React Router](https://reactrouter.com/) |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| Hosting | [Vercel](https://vercel.com/) |

---

## 🚀 Instalación y Uso

### Requisitos previos
- [Node.js](https://nodejs.org/) 18 o superior
- npm (incluido con Node.js)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/agendaestudiantil/Agenda-Estudiantil.git

# 2. Entrar a la carpeta
cd Agenda-Estudiantil

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev
```

Luego abre [http://localhost:5173](http://localhost:5173) en tu navegador.

> 💡 **Nota:** La app funciona en **modo demo** sin necesidad de configurar Supabase. Los datos se mantienen en memoria durante la sesión.

### Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza la build de producción |
| `npm run lint` | Revisa el código con ESLint |

---

## ⚙️ Configuración de Supabase (opcional)

Para habilitar la persistencia real de datos, crea un archivo `.env` en la raíz basándote en `.env.example`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
```

Consulta el [ROADMAP.md](./ROADMAP.md) para ver el esquema completo de la base de datos.

---

## 📁 Estructura del Proyecto

```
agenda-estudiantil/
├── public/                   # Recursos estáticos (favicon, iconos)
├── src/
│   ├── components/
│   │   └── layout/           # Header, BottomNav, AppLayout
│   ├── context/              # AuthContext, TaskContext (estado global)
│   ├── data/                 # Mensajes motivacionales
│   ├── lib/                  # Cliente de Supabase, algoritmo de prioridad
│   ├── pages/                # Home, Tasks, Calendar, Add, Messages, Profile
│   ├── types/                # Definiciones de tipos TypeScript
│   ├── App.tsx               # Configuración de rutas
│   ├── main.tsx              # Punto de entrada
│   └── index.css             # Estilos globales y tema de Tailwind
├── ROADMAP.md                # Plan de desarrollo por fases
└── package.json
```

---

## 🎨 Diseño

La interfaz sigue un diseño **mobile-first** con una paleta de colores pastel:

- 🌸 **Rosa** (primario) — botones y acentos
- 💜 **Púrpura** (secundario) — elementos de apoyo
- 🔴 **Rojo** — tareas urgentes
- 🟡 **Amarillo** — tareas importantes
- 🟢 **Verde** — tareas en progreso / día actual

Con navegación inferior de 6 pestañas y un header con gradiente arcoíris.

---

## 🗺️ Roadmap

El desarrollo está organizado en 7 fases. Consulta el detalle completo en [ROADMAP.md](./ROADMAP.md):

1. ✅ **Fundación y estructura** — UI completa y funcional
2. ⏳ **Backend con Supabase** — autenticación y base de datos
3. ⏳ **Sistema inteligente** — priorización avanzada
4. ⏳ **Notificaciones** — recordatorios push
5. ⏳ **Gamificación** — puntos, rachas, insignias
6. ⏳ **PWA** — instalable y offline
7. ⏳ **Deploy y documentación final**

---

## 👥 Créditos

**Proyecto académico desarrollado para el SENA — 2026**

- **Autoras:** Karen Melissa Manosalva Barrera · Sarita Yaniry Perez Vega
- **Institución:** Colegio Bethel — Grado 11°A
- **Instructora SENA:** Yesenia Pabon
- **Desarrollador:** Yilmar Vega — [yilmarvegag.dev](https://yilmarvegag.dev)

---

## 📄 Licencia

Este proyecto fue creado con fines educativos como parte de la formación en el SENA.
