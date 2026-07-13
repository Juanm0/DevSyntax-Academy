# DevSyntax Academy

Plataforma de cursos cortos y en vivo para gente que quiere entrar al mundo tech: HTML/CSS desde cero e inglés técnico para programadores. Grupos chicos, clases en vivo, proyecto real al final de cada curso.

## Stack

- **React 19** + **Vite** — frontend
- **React Router** — navegación
- **Supabase** — autenticación, base de datos (Postgres) y control de acceso por rol

## Estructura del proyecto

```
src/
├── components/
│   ├── course/       # Tarjeta de curso (CourseCard)
│   ├── layout/        # Navbar, Footer, MainLayout
│   └── ui/            # Button, Input, AuthCard (componentes reutilizables)
├── hooks/
│   └── useAuth.js     # Hook de sesión + perfil del usuario logueado
├── pages/              # Una página por ruta (Home, Login, Register, Course, Dashboards)
├── services/           # Toda la comunicación con Supabase vive acá
│   ├── auth.service.js
│   ├── course.service.js
│   ├── enrollment.service.js
│   └── supabaseClient.js
└── styles/             # Estilos globales
```

## Roles de usuario

La plataforma tiene tres roles, guardados en la tabla `profiles` (columna `role`):

| Rol | Puede |
|---|---|
| `admin` | Crear y editar cursos, ver todos los cursos |
| `teacher` | Ver y administrar las clases de sus propios cursos |
| `student` | Inscribirse a cursos y ver su progreso |

## Cómo correr el proyecto en local

1. Cloná el repo e instalá las dependencias:
   ```bash
   npm install
   ```

2. Creá un archivo `.env` en la raíz (no lo subas a git, ver más abajo) con:
   ```
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
   ```
   Estos valores salen de tu proyecto en [supabase.com](https://supabase.com) → **Settings → API**.

3. Corré el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Variables de entorno y seguridad

**Importante:** el archivo `.env` nunca debe subirse al repositorio. Contiene las claves de conexión a la base de datos. Asegurate de que `.env` esté en `.gitignore` antes de tu próximo commit.

## Scripts disponibles

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run lint` — corre ESLint sobre el proyecto
- `npm run preview` — previsualiza el build de producción
