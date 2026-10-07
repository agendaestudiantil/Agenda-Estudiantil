# Supabase — Configuración de la base de datos

Esta carpeta contiene el esquema SQL (`schema.sql`) que define todas las tablas,
las políticas de seguridad a nivel de fila (RLS) y el trigger que crea el perfil
del usuario automáticamente al registrarse.

## 1. Aplicar el esquema

1. Entra al [dashboard de Supabase](https://supabase.com/dashboard) y abre tu proyecto.
2. En el menú lateral abre **SQL Editor** y crea una nueva consulta (**New query**).
3. Copia **todo** el contenido de [`schema.sql`](./schema.sql) y pégalo en el editor.
4. Pulsa **Run** para ejecutarlo.

El script es idempotente (`create table if not exists`, `create or replace function`,
`drop trigger if exists`), por lo que puedes volver a ejecutarlo sin problemas.

## 2. Creación automática del perfil

El esquema define la función `handle_new_user()` y el trigger `on_auth_user_created`.
Cada vez que alguien se registra, se inserta automáticamente una fila en
`public.profiles` tomando:

- `name` de los metadatos del registro (`raw_user_meta_data.name`, vacío si no viene).
- `email` de la cuenta de autenticación.

No es necesario crear el perfil manualmente desde la aplicación.

## 3. Ajustes de autenticación

En el dashboard ve a **Authentication > Providers** y revisa el proveedor **Email**:

- Para desarrollo o pruebas locales puedes **desactivar la confirmación por correo**
  (*Confirm email*) para que los usuarios puedan iniciar sesión inmediatamente tras
  registrarse.
- Para producción se recomienda mantener la confirmación de correo activada.

## 4. Variables de entorno

El archivo `.env` del proyecto ya contiene las claves necesarias:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

No es necesario volver a introducirlas. **No compartas ni publiques estos valores.**

## Tablas incluidas

| Tabla       | Descripción                                      |
| ----------- | ------------------------------------------------ |
| `profiles`  | Perfil del usuario (1:1 con `auth.users`).       |
| `tasks`     | Tareas con prioridad y estado.                   |
| `events`    | Eventos del calendario.                          |
| `notes`     | Notas del usuario.                               |
| `goals`     | Metas y su progreso.                             |
| `reminders` | Recordatorios, opcionalmente ligados a una tarea.|
| `messages`  | Mensajes entre usuarios.                         |

Todas las tablas tienen **RLS activado**: cada usuario solo puede ver y modificar
sus propias filas (`profiles` por `id`, el resto por `user_id`; `messages` por
`sender_id`/`receiver_id`).
