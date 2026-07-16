# Entorno de desarrollo

| Herramienta   | Versión  | Cómo verificarlo |
|---------------|----------|------------------|
| Node          | 24.5.0   | `node --version` |
| yarn          | 1.22.19  | `yarn --version` |
| JDK           | 17       | `java --version` |
| Android SDK   | 35 (compile), 34 (target), 30 (min) | `sdkmanager --list` |
| Build Tools   | 35.0.0   | `sdkmanager --list` |
| Gradle        | 8.14.3   | `android/gradle/wrapper/gradle-wrapper.properties` |
| React Native  | 0.85.3   | `package.json` |

## .nvmrc

El archivo **`.nvmrc`** contiene solo la versión de Node (ej. `24.5.0`). Sirve para que en cada equipo (casa, trabajo, CI) se use automáticamente la misma versión de Node.

### ¿Cómo funciona?

1. Abre la terminal en la raíz del proyecto
2. Ejecuta:

```bash
nvm use
```

Si usas **fnm** (Fast Node Manager, multiplataforma):

```bash
fnm use
```

Esto lee `.nvmrc` y cambia a la versión especificada. Si no la tienes instalada, ejecuta primero:

```bash
nvm install
```

### Instalación de nvm

| Sistema | Herramienta | Instalación |
|---------|-------------|-------------|
| Windows | nvm-windows | `winget install nvm-windows` o desde [github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) |
| macOS   | nvm         | `brew install nvm` |
| Linux   | nvm         | `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh \| bash` |
| Cualquier OS | fnm    | `winget install fnm` / `brew install fnm` / `curl -fsSL https://fnm.vercel.app/install \| bash` |

### Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `nvm use` | Cambia a la versión del `.nvmrc` |
| `nvm install` | Instala la versión del `.nvmrc` si no está |
| `nvm ls` | Lista versiones instaladas |
| `node --version` | Verifica la versión activa |
