# Conexión al backend

El frontend usa `VITE_API_URL=/api` en local y en Azure Static Web Apps.

| Entorno | Proxy | Origen de `API_PROXY_TARGET` |
| --- | --- | --- |
| Local (`npm run dev`) | Servidor de Vite | `.env` / `.env.local` |
| Azure Static Web Apps | Azure Function en `api/` | Variables de entorno del portal |

Por ejemplo, `/api/tickets` se reenvía a
`https://backend.example.com/api/tickets`. `API_PROXY_TARGET` es el origen
del backend, sin `/api`. Se conservan método, query, cuerpo, token Bearer,
estado HTTP y contenido de la respuesta. El navegador se comunica con el
mismo origen del frontend, por lo que no necesita CORS hacia el backend.

## Desarrollo local

Instala las dependencias con `npm ci` y configura `.env.local`
(puedes copiar `.env.example`):

```dotenv
VITE_API_URL=/api
API_PROXY_TARGET=https://localhost:7272
```

Ejecuta `npm run dev`. Reinicia Vite después de cambiar las variables.
Los certificados autofirmados se aceptan solo para el backend en localhost.

## Azure Static Web Apps

En **Configuración → Variables de entorno → Producción**, conserva:

```dotenv
API_PROXY_TARGET=https://backend.example.com
VITE_API_URL=/api
```

El workflow despliega el frontend (`dist`) y la función proxy (`api`), con
runtime Node.js 22. La función lee `API_PROXY_TARGET` en cada petición;
para cambiar el backend basta con guardar esa variable en Azure.
No hace falta duplicarla en GitHub Actions ni incorporarla al build del frontend.
El destino en Azure debe ser un backend público con HTTPS y certificado válido.

Las variables del portal de Azure Static Web Apps solo están disponibles
para su API. `VITE_API_URL` del portal no cambia el JavaScript compilado:
el frontend ya usa `/api` como valor predeterminado. Mantén `VITE_API_URL=/api`
en los archivos `.env` usados para compilar. Si eliges una URL absoluta para
`VITE_API_URL` en el build, el navegador llamará directamente a esa URL y
necesitarás CORS en el backend.

Esta diferencia entre configuración de API y de build está documentada por
[Microsoft](https://learn.microsoft.com/en-us/azure/static-web-apps/application-settings).

El proxy devuelve `503` si `API_PROXY_TARGET` falta o es inválido, `502` si
no puede conectar al backend y `504` si la petición supera los 30 segundos.
Los errores HTTP que responde el backend se conservan.

## Validación

```sh
npm run build
npm run lint
npm --prefix api ci
npm --prefix api test
```

Las pruebas del proxy verifican el reenvío HTTP contra un backend local de prueba.
`npm run preview` solo sirve el frontend; para probar `/api` usa `npm run dev`
o el entorno completo de Azure Static Web Apps.
