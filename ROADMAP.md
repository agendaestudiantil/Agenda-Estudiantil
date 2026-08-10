# 📚 ROADMAP - Agenda Estudiantil Inteligente y Motivacional

**Proyecto:** Agenda Estudiantil Inteligente y Motivacional  
**Autoras:** Karen Melissa Manosalva Barrera, Sarita Yaniry Perez Vega  
**Institución:** Colegio Bethel - 11°A  
**Instructor SENA:** Yesenia Pabon  
**Fecha:** Agosto 2026  

---

## 🎯 Objetivo del Proyecto

Desarrollar una aplicación web progresiva (PWA) que funcione como agenda estudiantil inteligente, permitiendo a los estudiantes del Colegio Bethel organizar sus tareas, priorizar actividades automáticamente, recibir recordatorios y mantenerse motivados mediante un sistema de gamificación.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Framework Frontend | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Estilos | Tailwind CSS 4 |
| Iconos | Lucide React |
| Fechas | date-fns |
| Backend/DB | Supabase (PostgreSQL + Auth + Realtime) |
| Hosting | Vercel (gratuito) |
| PWA | vite-plugin-pwa |

---

## 📱 Pantallas de la Aplicación

| # | Pantalla | Descripción |
|---|----------|-------------|
| 1 | **Home (Inicio)** | Dashboard con próximas tareas, mini calendario y mensaje motivacional diario |
| 2 | **Mensajes** | Chat entre estudiantes con soporte de texto y emojis |
| 3 | **Mis Tareas** | Lista completa de tareas con filtros (Todas, Pendientes, En progreso, Completadas) |
| 4 | **Calendario** | Vista mensual interactiva con eventos del día |
| 5 | **Agregar (+)** | Selector para crear: Tarea, Evento, Nota, Meta Personal, Recordatorio |
| 6 | **Perfil** | Información personal, metas, ajustes, estadísticas de puntos y rachas |

---

## 📋 Fases de Desarrollo

### Fase 1: Fundación y Estructura (Semana 1-2)
**Estado:** ✅ Completada

| Tarea | Descripción | Estado |
|-------|-------------|--------|
| Configurar proyecto | Vite + React + TypeScript + Tailwind CSS | ✅ |
| Path aliases | Configurar `@/` para imports limpios | ✅ |
| Diseño de tipos | TypeScript interfaces para toda la app | ✅ |
| Layout principal | Header con gradiente arcoíris + Bottom Navigation (6 tabs) | ✅ |
| Sistema de rutas | React Router con 6 pantallas principales | ✅ |
| Contexto de Auth | Provider con modo demo sin Supabase | ✅ |
| Contexto de Tareas | Provider con CRUD completo y datos demo | ✅ |
| Pantalla Home | Dashboard con tareas, calendario mini, mensaje motivacional | ✅ |
| Pantalla Tareas | Lista filtrable con checkboxes y badges de prioridad | ✅ |
| Pantalla Calendario | Vista mensual con eventos del día | ✅ |
| Pantalla Agregar | Grid de opciones + formularios (Tarea, Evento, Nota, Meta, Recordatorio) | ✅ |
| Pantalla Mensajes | Chat funcional con burbujas estilo WhatsApp | ✅ |
| Pantalla Perfil | Avatar, datos, menú, puntos, rachas, cerrar sesión | ✅ |
| Algoritmo de priorización | Score basado en urgencia × (1/días restantes) | ✅ |
| Mensajes motivacionales | 12 mensajes con rotación diaria | ✅ |

---

### Fase 2: Backend con Supabase (Semana 3-4)
**Estado:** ⏳ Pendiente

| Tarea | Descripción |
|-------|-------------|
| Crear proyecto Supabase | Configurar proyecto gratuito en supabase.com |
| Esquema de base de datos | Crear tablas: profiles, tasks, events, notes, goals, reminders, messages |
| Row Level Security (RLS) | Políticas para que cada usuario solo vea sus datos |
| Auth con email | Registro + Login + Recuperar contraseña |
| Migrar datos demo | Conectar contextos a Supabase en lugar de estado local |
| Sincronización en tiempo real | Suscripciones para actualizaciones instantáneas |

**Esquema de Base de Datos:**

```sql
-- Perfiles de usuario
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'Estudiante',
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tareas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  priority TEXT CHECK (priority IN ('urgente', 'importante', 'tiempo')),
  status TEXT CHECK (status IN ('pendiente', 'en_progreso', 'completada')),
  due_date DATE NOT NULL,
  completed_at TIMESTAMPTZ,
  reminder_days_before INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Eventos
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  color TEXT DEFAULT '#60a5fa',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notas
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Metas personales
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  target_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recordatorios
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT,
  remind_at TIMESTAMPTZ NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mensajes
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT CHECK (type IN ('text', 'audio')) DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Fase 3: Sistema Inteligente de Priorización (Semana 5)
**Estado:** ⏳ Pendiente

| Tarea | Descripción |
|-------|-------------|
| Algoritmo avanzado | Considerar historial del estudiante y patrones |
| Sugerencias inteligentes | "Deberías empezar X porque te tomará más tiempo" |
| Detección de conflictos | Alertar cuando hay muchas tareas el mismo día |
| Reordenamiento automático | Ajustar prioridades cuando cambian las fechas |

---

### Fase 4: Notificaciones y Recordatorios (Semana 6)
**Estado:** ⏳ Pendiente

| Tarea | Descripción |
|-------|-------------|
| Push Notifications | Web Push API para notificaciones del navegador |
| Service Worker | Registrar SW para notificaciones en background |
| Programar recordatorios | Cron jobs en Supabase Edge Functions |
| Configuración por usuario | Elegir cuándo y cómo recibir avisos |

---

### Fase 5: Gamificación y Motivación (Semana 7-8)
**Estado:** ⏳ Pendiente

| Tarea | Descripción |
|-------|-------------|
| Sistema de puntos | +10 por tarea a tiempo, +5 por tarea tarde, +20 por racha |
| Rachas (streaks) | Contador de días consecutivos completando tareas |
| Insignias/Badges | "Primera semana perfecta", "10 tareas completadas", etc. |
| Nivel de estudiante | Progresión: Novato → Dedicado → Experto → Maestro |
| Tabla de clasificación | Ranking entre compañeros (opcional) |
| Animaciones de logro | Confetti/celebración al desbloquear badge |

---

### Fase 6: PWA y Experiencia Móvil (Semana 9)
**Estado:** ⏳ Pendiente

| Tarea | Descripción |
|-------|-------------|
| Manifest.json | Configurar nombre, iconos, colores de la app |
| Service Worker | Cache de recursos para funcionamiento offline |
| Install prompt | Botón "Instalar app" para Android/iOS |
| Splash screen | Pantalla de carga con logo |
| Offline mode | Funcionalidad básica sin conexión |

---

### Fase 7: Pulido y Deploy (Semana 10)
**Estado:** ⏳ Pendiente

| Tarea | Descripción |
|-------|-------------|
| Optimización | Code splitting, lazy loading de páginas |
| Accesibilidad | ARIA labels, navegación por teclado, contraste |
| Testing | Pruebas manuales en diferentes dispositivos |
| SEO básico | Meta tags, Open Graph para compartir |
| Deploy en Vercel | Configurar dominio y deploy automático |
| Documentación | Manual de usuario y guía de instalación |

---

## 📊 Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Tareas completadas a tiempo | > 70% de las tareas registradas |
| Uso diario | Al menos 1 ingreso por día escolar |
| Satisfacción del usuario | > 4/5 en encuesta de usabilidad |
| Rendimiento técnico | Lighthouse score > 90 |
| Tiempo de carga | < 2 segundos |

---

## 🎨 Guía de Diseño Visual

### Paleta de colores
- **Primario:** Rosa (#f472b6) - botones, acentos
- **Secundario:** Púrpura (#a78bfa) - elementos secundarios
- **Urgente:** Rojo (#f87171)
- **Importante:** Amarillo (#fbbf24)
- **En progreso:** Verde (#34d399)
- **Fondo:** Gradiente pastel (rosa → blanco → verde claro)
- **Header:** Gradiente arcoíris suave

### Tipografía
- **Fuente:** Inter (Google Fonts)
- **Títulos:** Semi-bold / Bold
- **Cuerpo:** Regular 14px
- **Etiquetas:** Medium 12px

### Componentes
- **Cards:** Fondo blanco con blur, bordes redondeados (16px), sombra suave
- **Botones:** Redondeados (12px), colores sólidos con hover
- **Badges:** Pill shape con colores de prioridad
- **Navegación:** Bottom tab bar con 6 items, icono activo resaltado

---

## 📅 Cronograma Resumido

```
Agosto 2026
├── Semana 1-2: ✅ Estructura completa + UI funcional
├── Semana 3-4: Backend con Supabase
├── Semana 5: Sistema inteligente
├── Semana 6: Notificaciones
├── Semana 7-8: Gamificación
├── Semana 9: PWA
└── Semana 10: Deploy + documentación

Octubre 2026: Presentación final
```

---

## 💰 Presupuesto

| Recurso | Costo |
|---------|-------|
| Supabase (Free Tier) | $0 |
| Vercel Hosting (Free) | $0 |
| Dominio .com (opcional) | ~$12 USD/año |
| Google Fonts | $0 |
| Lucide Icons | $0 |
| Total mínimo | **$0** |
| Total con dominio | **~$12 USD** |

---

## 🚀 Cómo Ejecutar el Proyecto

```bash
# 1. Clonar o ir al directorio
cd agenda-estudiantil

# 2. Instalar dependencias
npm install

# 3. Ejecutar en desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

**Nota:** El proyecto funciona en modo demo sin necesidad de configurar Supabase. Para producción, crear un proyecto en [supabase.com](https://supabase.com) y agregar las variables de entorno.

---

## 📝 Notas Adicionales

- La aplicación funciona completamente en modo demo sin backend
- Los datos se mantienen en memoria durante la sesión (se reinician al recargar)
- Para persistencia real, conectar con Supabase siguiendo la Fase 2
- Diseño mobile-first optimizado para pantallas de 375px-428px
- Compatible con Chrome, Safari, Firefox y Edge

---

*Documento generado como parte del desarrollo del proyecto Agenda Estudiantil Inteligente y Motivacional - SENA 2026*
