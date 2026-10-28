# Tickets Web

Frontend de gestión de tickets desarrollado con React, TypeScript y Vite.

## Local setup

### 1. Preparar los requisitos

Instala Git y Node.js **22.x**, que incluye npm. Comprueba que estén disponibles en tu terminal:

```sh
git --version
node --version
npm --version
```

Para utilizar la aplicación completa necesitas tener el backend de tickets en ejecución y una cuenta válida para iniciar sesión. Este repositorio contiene el frontend y el proxy para Azure; el backend se configura y ejecuta por separado siguiendo las instrucciones de su propio repositorio.

### 2. Clonar el repositorio

```sh
git clone https://github.com/ElQuenta/tickets-web.git
cd tickets-web
```

Ejecuta los siguientes comandos desde esta carpeta, donde se encuentra `package.json`.

### 3. Instalar las dependencias

```sh
npm ci
```

Este comando instala las versiones registradas en `package-lock.json`.

### 4. Configurar las variables de entorno

Copia `.env.example` a `.env`.

En Windows con PowerShell:

```powershell
Copy-Item .env.example .env
```

En Linux o macOS:

```sh
cp .env.example .env
```

Abre `.env.` y configura el destino del backend:

```dotenv
VITE_API_URL=/api
API_PROXY_TARGET=https://localhost:7272
```

Mantén `VITE_API_URL=/api` y ajusta `API_PROXY_TARGET` al protocolo, host y puerto reales de tu backend, **sin agregar `/api` al final**. El valor `https://localhost:7272` es un ejemplo; debe coincidir con la dirección donde esté ejecutándose tu API.

Por ejemplo, una petición del frontend a `/tickets` se reenviará a `https://localhost:7272/api/tickets` con esa configuración.

### 5. Iniciar el backend

En otra terminal, inicia el backend siguiendo su guía de ejecución y confirma que la dirección que muestra coincida con `API_PROXY_TARGET`. Si utilizas un backend remoto disponible, configura su origen en esa variable.

Mantén el backend disponible mientras utilizas el frontend. Sin esa conexión, la pantalla puede cargar, pero el inicio de sesión y las operaciones de tickets no funcionarán.

> [!NOTE]
> Considera de igual forma que puedes utilizar la conexion a un deploy del backend

### 6. Iniciar el frontend

Desde la carpeta `tickets-web`, ejecuta:

```sh
npm run dev
```

Abre la dirección que Vite muestra en la terminal, normalmente `http://localhost:5173`. Si el puerto está ocupado, utiliza la dirección que indique Vite.

En desarrollo local, Vite se encarga del proxy hacia el backend. No es necesario iniciar la Azure Function de `api/` ni instalar sus dependencias para este flujo.