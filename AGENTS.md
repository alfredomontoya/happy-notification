# STMSC Cumpleañeros — AGENTS.md

## Stack
- **Framework:** React Native 0.85.3
- **Language:** TypeScript 5.8+
- **Runtime:** Node >= 22.11.0 (recomendado 24.5.0)
- **Package manager:** yarn (lock: yarn.lock)
- **Auth & Cloud DB:** Firebase (Auth, Firestore, Functions)
- **Local DB:** SQLite via `react-native-sqlite-storage` (caché de cumpleaños)
- **Navigation:** React Navigation 7 (Drawer + Native Stack)
- **Notifications:** Notifee (recordatorio diario de cumpleaños)

## Scripts
| Comando | Descripción |
|---|---|
| `yarn start` | Inicia Metro bundler |
| `yarn android` | Build + run en Android |
| `yarn ios` | Build + run en iOS |
| `yarn test` | Ejecuta Jest |
| `yarn lint` | ESLint sobre todo el proyecto |

## Estructura del proyecto
```
AwesomeProject/
├── App.tsx                      # Componente raíz (providers + Drawer navigator)
├── index.js                     # Entry point (AppRegistry)
├── app.json                     # Nombre y displayName de la app
├── android/                     # Proyecto nativo Android (Gradle)
├── ios/                         # Proyecto nativo iOS (Xcode + CocoaPods)
├── functions/                   # Cloud Functions de Firebase
│   ├── index.js                 #   updateUserPassword (solo admin)
│   └── package.json
├── data/                        # Archivos de ejemplo para importación
│   ├── funcionario.xlsx
│   ├── funcionario.csv
│   ├── gestion.csv
│   └── gestion.xlsx
├── __tests__/                   # Tests con Jest
├── src/
│   ├── assets/
│   │   └── logo.png             # Escudo de SC (splash + login)
│   ├── components/
│   │   ├── DrawerMenu.tsx       # Menú lateral animado (legacy)
│   │   ├── FiltroChips.tsx      # Chips: Hoy / Semana / Mes
│   │   ├── NetworkBanner.tsx    # Banner offline
│   │   ├── NotificationBanner.tsx # Banner animado tipo "social"
│   │   └── PersonaCard.tsx      # Card de persona en la lista
│   ├── context/
│   │   ├── AuthContext.tsx       # Auth + perfil de usuario (Firebase)
│   │   ├── DrawerContext.tsx    # Estado del drawer (legacy)
│   │   ├── NetworkContext.tsx   # Conectividad de red
│   │   └── ThemeContext.tsx     # Tema claro/oscuro con persistencia
│   ├── database/
│   │   ├── firebase.ts          # Instancias de Auth, Firestore, Functions
│   │   ├── sqlite.ts            # DB local SQLite + CREATE TABLE personas
│   │   ├── types.ts             # Interfaces: Persona, Funcionario, Gestion, UserProfile, Permissions
│   │   ├── personas.ts          # CRUD cumpleaños (SQLite)
│   │   ├── personasCache.ts     # Caché en memoria de personas (5 min TTL)
│   │   ├── funcionarios.ts      # CRUD funcionarios (Firestore) con búsqueda
│   │   ├── funcionariosCache.ts # Caché en memoria de funcionarios (30 min TTL)
│   │   ├── gestion.ts           # CRUD gestiones anuales (Firestore)
│   │   ├── usuarios.ts          # CRUD usuarios + admin seed + reset password
│   │   ├── init.ts              # Inicialización: SQLite + admin + migración
│   │   └── migrate.ts           # Migración Firestore → SQLite de personas
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Drawer navigator + 6 stacks (Cumpleaños, Funcionarios, Gestión, Configuración, Perfil, Usuarios)
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Lista de cumpleaños + búsqueda + filtros + FAB
│   │   ├── DetailScreen.tsx     # Detalle de persona (cumpleaños)
│   │   ├── FormScreen.tsx       # Crear/editar persona (cumpleaños)
│   │   ├── ImportScreen.tsx     # Importar Excel personas con mapeo flexible
│   │   ├── LoginScreen.tsx      # Login con usuario/email + reset password
│   │   ├── CreditsScreen.tsx    # Acerca de / créditos
│   │   ├── FuncionariosListScreen.tsx  # Lista de funcionarios por gestión
│   │   ├── FuncionarioDetailScreen.tsx # Detalle de funcionario
│   │   ├── FuncionarioFormScreen.tsx   # Crear/editar funcionario
│   │   ├── ImportExcelFuncionariosScreen.tsx # Importar Excel funcionarios
│   │   ├── GestionListScreen.tsx       # Lista de gestiones anuales
│   │   ├── GestionFormScreen.tsx       # Crear/editar gestión
│   │   ├── ConfiguracionScreen.tsx     # Configuración general
│   │   ├── PerfilScreen.tsx            # Perfil del usuario autenticado
│   │   ├── UsuariosScreen.tsx          # Admin: listar usuarios
│   │   ├── UsuarioFormScreen.tsx       # Admin: crear/editar usuario
│   │   ├── ProfileScreen.tsx    # Perfil (legacy)
│   │   ├── SettingsScreen.tsx   # Settings (legacy)
│   │   └── FuncionariosScreen.tsx # Funcionarios (legacy)
│   ├── services/
│   │   └── notifications.ts    # Notifee: canal + notif diaria 8 AM
│   ├── theme/
│   │   └── colors.ts           # Paleta verde esmeralda (light mode)
│   └── utils/
│       ├── filtros.ts          # Filtros por nombre/CI/fecha (hoy/semana/mes)
│       ├── uuid.ts             # Generador de UUID v4
│       ├── xlsxParser.ts       # Parseo Excel → personas con mapeo flexible
│       └── xlsxParserFuncionarios.ts # Parseo Excel → funcionarios con mapeo flexible
├── .eslintrc.js                 # ESLint: @react-native
├── .prettierrc.js               # Prettier: singleQuote, avoidParens, trailingComma
├── babel.config.js              # Babel preset @react-native + reanimated plugin
├── metro.config.js              # Metro con assetExts: xlsx
├── tsconfig.json                # TypeScript strict (extends @react-native/typescript-config)
├── jest.config.js               # Jest @react-native/jest-preset
├── .nvmrc                       # Node 24.5.0
├── REQUIREMENTS.md              # Requisitos del entorno
└── Gemfile                      # Dependencias Ruby (CocoaPods)
```

## Dependencias principales
- `@react-native-firebase/app`, `auth`, `firestore`, `functions` — Backend en la nube
- `react-native-sqlite-storage` — Caché local de cumpleaños
- `@react-navigation/native` + `native-stack` + `drawer` — Navegación
- `@notifee/react-native` — Notificaciones locales de cumpleaños
- `xlsx` + `@react-native-documents/picker` — Importación Excel
- `date-fns` — Manipulación de fechas
- `@react-native-community/datetimepicker` — DatePicker nativo
- `@react-native-async-storage/async-storage` — Persistencia de tema
- `@react-native-community/netinfo` — Detección de conectividad
- `react-native-gesture-handler` + `react-native-reanimated` — Gestos/animaciones

## Convenciones de código
- **Estilo:** Prettier con `singleQuote`, `arrowParens: "avoid"`, `trailingComma: "all"`
- **Testing:** Jest con `react-test-renderer`. Tests en `__tests__/` con sufijo `.test.tsx`
- **Linting:** ESLint con extensión `@react-native`
- **TypeScript:** Strict mode via `@react-native/typescript-config`
- **Nombrado:** PascalCase para componentes, camelCase para funciones/variables
- **Imports:** Sin comentarios de sección; imports agrupados por librería externa → interna
- **Estilos:** `StyleSheet.create` (no librerías CSS-in-JS externas)
- **Componentes:** Funcionales con hooks (no clases)

## Arquitectura de datos

### Capa primaria — Firebase Firestore
- `usuarios` — Perfiles de usuario con roles y permisos
- `funcionarios` — Registro de empleados con búsqueda por tokens
- `gestiones` — Gestiones anuales

### Capa secundaria — SQLite local
- `personas` — Cumpleaños (sincronizado desde Firestore vía migración)

### Caché en memoria
- `personasCache` — TTL 5 min
- `funcionariosCache` — TTL 30 min (por gestión)

## Autenticación y permisos
- Firebase Auth con email/contraseña
- Login acepta username o email (resuelve username → email localmente)
- Perfiles en Firestore colección `usuarios`
- Roles: `admin` | `user`
- Permisos por módulo: `none` | `read` | `write` | `admin`
- Admin por defecto: `admin` / `admin123` (seed automático al iniciar)

## Módulos del Drawer
| Módulo | Permiso | Descripción |
|---|---|---|
| 🎂 Cumpleaños | `cumpleanios` | CRUD personas + filtros + notificación diaria |
| 👥 Funcionarios | `funcionarios` | CRUD empleados por gestión + búsqueda + import Excel |
| 📁 Gestión | `gestiones` | CRUD gestiones anuales |
| ⚙️ Configuración | `configuracion` | Importar Excel, créditos |
| 👤 Perfil | — | Datos del usuario autenticado |
| 🔐 Usuarios | solo admin | CRUD usuarios del sistema |

## Pantallas (19)
| Pantalla | Ruta | Descripción |
|---|---|---|
| Login | — | Login con usuario/email + reset password + toggle tema |
| Home | `Home` | Lista de cumpleaños con búsqueda y filtros |
| Detail | `Detail` | Detalle de persona (cumpleaños) |
| Form | `Form` | Crear/editar persona (cumpleaños) |
| Import | `Import` | Importación Excel personas |
| Credits | `Credits` | Acerca de / créditos |
| FuncionariosList | `FuncionariosList` | Lista de funcionarios por gestión |
| FuncionarioDetail | `FuncionarioDetail` | Detalle de funcionario |
| FuncionarioForm | `FuncionarioForm` | Crear/editar funcionario |
| ImportExcelFuncionarios | `ImportExcelFuncionarios` | Importación Excel funcionarios |
| GestionList | `GestionList` | Lista de gestiones anuales |
| GestionForm | `GestionForm` | Crear/editar gestión |
| ConfigMain | `ConfigMain` | Configuración general |
| PerfilMain | `PerfilMain` | Perfil del usuario |
| UsuariosList | `UsuariosList` | Admin: listar usuarios |
| UsuarioForm | `UsuarioForm` | Admin: crear/editar usuario |

## Notificaciones
- Canal `birthdays` con importancia HIGH
- Notificación diaria programada a las 8:00 AM via `scheduleDailyReminder`
- Notificación inmediata al abrir la app si hay cumpleaños hoy via `showBirthdayNotification`
- Notifee maneja eventos en background

## Importación Excel
- Dos módulos independientes: personas (cumpleaños) y funcionarios
- Mapeo flexible de columnas: auto-detección por nombre de encabezado + edición manual
- Soporta formatos de fecha: ISO, DD/MM/AAAA, número serial de Excel, UTC
- Preview de datos antes de importar

## Cloud Functions
| Función | Descripción |
|---|---|
| `updateUserPassword` | Cambia contraseña de cualquier usuario (solo admin autenticado) |

## Testing
```bash
yarn test                # Ejecuta tests
yarn test --watch        # Modo watch
```

## CI / Lint / TypeCheck
```bash
yarn lint
npx tsc --noEmit
```
