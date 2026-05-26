# AwesomeProject — AGENTS.md

## Stack
- **Framework:** React Native 0.85.3
- **Language:** TypeScript 5.8+
- **Runtime:** Node >= 22.11.0
- **Package manager:** yarn (lock: yarn.lock)
- **Database:** SQLite via `react-native-sqlite-storage`
- **Navigation:** React Navigation 7 (native-stack)

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
├── App.tsx                      # Componente raíz (SafeAreaProvider + Navigator)
├── index.js                     # Entry point (AppRegistry)
├── app.json                     # Nombre y displayName de la app
├── android/                     # Proyecto nativo Android (Gradle)
│   └── app/src/main/res/        # Splash screen config
├── ios/                         # Proyecto nativo iOS (Xcode + CocoaPods)
├── __tests__/                   # Tests con Jest
├── src/
│   ├── assets/
│   │   └── logo.png             # Escudo de SC (splash + header)
│   ├── components/
│   │   ├── FiltroChips.tsx      # Chips: Hoy / Semana / Mes
│   │   ├── NotificationBanner.tsx # Banner animado tipo "social"
│   │   └── PersonaCard.tsx      # Card de persona en la lista
│   ├── database/
│   │   ├── init.ts              # CREATE TABLE + seed 50 registros
│   │   ├── personas.ts          # CRUD completo
│   │   └── types.ts             # interface Persona
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Stack navigator (4 pantallas)
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Lista + filtros + notificaciones
│   │   ├── DetailScreen.tsx     # Detalle de persona
│   │   ├── FormScreen.tsx       # Crear/editar persona
│   │   └── ImportScreen.tsx     # Importar Excel con mapeo flexible
│   ├── theme/
│   │   └── colors.ts            # Paleta verde esmeralda
│   └── utils/
│       ├── filtros.ts           # Filtros por nombre/CI/fecha
│       └── seed.ts              # Generar 50 personas con faker
├── .eslintrc.js                 # ESLint: @react-native
├── .prettierrc.js               # Prettier: singleQuote, avoidParens, trailingComma
├── babel.config.js              # Babel preset @react-native
├── metro.config.js              # Metro bundler config
├── tsconfig.json                # TypeScript strict
├── jest.config.js               # Jest @react-native/jest-preset
└── Gemfile                      # Dependencias Ruby (CocoaPods)
```

## Dependencias principales
- `@react-navigation/native` + `@react-navigation/native-stack` — Navegación
- `react-native-sqlite-storage` — Base de datos SQLite local
- `xlsx` + `@react-native-documents/picker` — Importación Excel
- `date-fns` — Manipulación de fechas
- `@react-native-community/datetimepicker` — DatePicker nativo
- `@faker-js/faker` — Generación de datos semilla (dev)

## Convenciones de código
- **Estilo:** Prettier con `singleQuote`, `arrowParens: "avoid"`, `trailingComma: "all"`
- **Testing:** Jest con `react-test-renderer`. Tests en `__tests__/` con sufijo `.test.tsx`
- **Linting:** ESLint con extensión `@react-native`
- **TypeScript:** Strict mode via `@react-native/typescript-config`
- **Nombrado:** PascalCase para componentes, camelCase para funciones/variables
- **Imports:** Sin comentarios de sección; imports agrupados por librería externa → interna

## Patrones del proyecto
- Componente raíz `App` en `App.tsx`, registrado vía `AppRegistry.registerComponent`
- `SafeAreaProvider` de `react-native-safe-area-context` en la raíz
- `NavigationContainer` + `createNativeStackNavigator` para navegación
- `StyleSheet.create` para estilos (no librerías CSS-in-JS externas)
- Componentes funcionales con hooks (no clases)
- SQLite database inicializada con 50 registros aleatorios al primer inicio
- Paleta de colores: verde esmeralda (#0D9488) como primario

## Pantallas
| Pantalla | Ruta | Descripción |
|---|---|---|
| Home | `Home` | Lista de personas con búsqueda, filtros de cumpleaños y FABs |
| Detail | `Detail` | Vista detalle con datos, editar y eliminar |
| Form | `Form` | Formulario crear/editar persona |
| Import | `Import` | Importación Excel con mapeo flexible de columnas |

## Splash screen
- Android: tema `SplashTheme` con fondo verde esmeralda
- Se muestra al abrir la app y transiciona al contenido al cargar JS
- Configurado en `android/app/src/main/res/values/styles.xml` y `MainActivity.kt`

## Testing
```bash
yarn test                # Ejecuta tests
yarn test --watch        # Modo watch
```

## CI / Lint / TypeCheck
```bash
yarn lint
npx tsc --noEmit         # Type check (no hay script dedicado, ejecutar así)
```
