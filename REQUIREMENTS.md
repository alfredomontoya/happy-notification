# Entorno de desarrollo

| Herramienta    | Versión            | Cómo verificarlo                        |
|----------------|--------------------|-----------------------------------------|
| Node           | 24.5.0             | `node --version`                        |
| yarn           | 1.22.x             | `yarn --version`                        |
| JDK            | 17                 | `java --version`                        |
| Android SDK    | 35 (compile)       | `sdkmanager --list`                     |
| Build Tools    | 35.0.0             | `sdkmanager --list`                     |
| Gradle         | 8.14.3             | `android/gradle-wrapper.properties`     |
| React Native   | 0.85.3             | `package.json`                          |

## .nvmrc

El archivo **`.nvmrc`** contiene la versión de Node (`24.5.0`). Sirve para que en
cada equipo (casa, trabajo, CI) se use automáticamente la misma versión.

### ¿Cómo funciona?

```bash
nvm use      # o fnm use
```

Si no la tienes instalada:

```bash
nvm install
```

### Instalación de nvm (si no lo tienes)

| Sistema | Herramienta | Instalación |
|---------|-------------|-------------|
| Windows | nvm-windows | `winget install nvm-windows` |
| macOS   | nvm         | `brew install nvm` |
| Linux   | nvm         | `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh \| bash` |
| Cualquier OS | fnm    | `winget install fnm` / `brew install fnm` |

### Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `nvm use` | Cambia a la versión del `.nvmrc` |
| `nvm install` | Instala la versión del `.nvmrc` si no está |
| `nvm ls` | Lista versiones instaladas |
| `node --version` | Verifica la versión activa |

## Firebase

El proyecto usa Firebase para:

- **Authentication** — Inicio de sesión con email/contraseña
- **Firestore** — Base de datos principal (usuarios, funcionarios, gestiones)
- **Cloud Functions** — Lógica de servidor (cambio de contraseñas)

### Configuración

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilita **Authentication** con método *Email/Password*
3. Habilita **Cloud Firestore** en modo de prueba
4. Descarga el archivo `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
5. Colócalos en:
   - `android/app/google-services.json`
   - `ios/GoogleService-Info.plist`
6. Despliega las Cloud Functions:
   ```bash
   cd functions
   npm install
   npm run deploy
   ```

### Cloud Functions

| Función | Endpoint | Descripción |
|---------|----------|-------------|
| `updateUserPassword` | `onCall` | Cambia contraseña de un usuario (solo admin) |
