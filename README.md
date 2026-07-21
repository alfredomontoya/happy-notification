# STMSC Cumpleañeros 🎂

Aplicación móvil **React Native** para la gestión institucional del
**Sindicato de Trabajadores Municipales de Santa Cruz (STMSC)**.

Permite administrar cumpleaños, funcionarios, gestiones anuales y control de
usuarios con roles y permisos.

## Funcionalidades

- 🎂 **Cumpleaños** — Registro de personas con notificaciones diarias
  recordatorias, filtros por hoy/semana/mes y búsqueda por nombre o CI
- 👥 **Funcionarios** — Registro de empleados con CI, cargos, edificio,
  responsable y estado de entrega. Búsqueda inteligente con tokens
- 📁 **Gestión** — Gestiones anuales asociadas a funcionarios
- 🔐 **Usuarios y permisos** — Sistema de roles (admin/user) con permisos
  granulares por módulo (ninguno/lectura/escritura/admin)
- 📥 **Importación Excel** — Mapeo flexible de columnas con auto-detección y
  previsualización. Soporta personas y funcionarios
- 🌙 **Tema oscuro/claro** — Persistente entre sesiones
- 📡 **Offline** — Banner de conectividad con detección de red
- 🔔 **Notificaciones** — Recordatorio diario a las 8 AM de los cumpleaños

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React Native 0.85.3 + TypeScript |
| Backend | Firebase Auth + Firestore + Functions |
| Cache local | SQLite (react-native-sqlite-storage) |
| Navegación | React Navigation 7 (Drawer + Native Stack) |
| Notificaciones | Notifee |
| Importación | xlsx + Document Picker |

## Requisitos

Ver [REQUIREMENTS.md](./REQUIREMENTS.md).

## Inicio rápido

```bash
nvm use
yarn install
cd ios && bundle exec pod install && cd ..

# Android
yarn android

# iOS
yarn ios
```

## Scripts disponibles

```bash
yarn start      # Metro bundler
yarn android    # Build + run Android
yarn ios        # Build + run iOS
yarn test       # Jest tests
yarn lint       # ESLint
```

## Estructura del proyecto

Ver [AGENTS.md](./AGENTS.md) para la estructura completa y convenciones de código.
