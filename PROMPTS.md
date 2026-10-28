## Prompt 1
### Descripción
Desarrollo rapido implementando las librerias y endpoints creados
### Prompt

Ahora quiero que sigas la linea visual de login para lo que es la pagina de Tickets es decir tickets boardPage.
Esta pagina debe utilizar la libreria de @hello-pangea/dnd para realizar de forma visual el dashboard aprovechando sus funcionalidades de drag and drop
Funcionalidades de la pagina:
- presentar los tickets Ordenados por columnas en los correspondientes estados (El card debe mostrar Solamente el Titulo y el equipment)
- al dar click a un card de un ticket este debe abrir un modal el cual debe mostrar del ticket detail, es decir que debe mostrar la información completa además del historial de cambios. ordenados por fecha de más reciente a más atiguo
- Contar con un boton de creación de ticket, este debe abrir un modal con un from este debe contar con los campos marcados por el modelo del request.
- Para cuando el usuario es administrador debe ver debajo del tablero en un formato tipo tabla/list todos los tickets eliminados mostrando el titulo, equipment y fecha de borrado, este debe igualmente abrir el modal de detalles de ticket
- para cuando el usuario es administrador le debe aparecer la opción de editar el ticket, este dede abrir el formulario de creación con los datos precargados, cambiando el mensaje y llamado al API (en los cards de los tickets)
- Para cuando el usuario es administrador le debe aparecer la opción de eliminar un ticket, este abrir un modal de confirmación de eliminación donde se pide un commentario (razon de borrado) (en los cards de los tickets)
- Para cuando el usuario es Administrador alado del boton de creación de ticket debe aparecer el boton para ir al userboard
- en los cards de detalles que hayan sido borrados en caso de no ser un usuario con el rol Operator (valida que sea Admin o Technician) y no haber sido borrados (Valida el deleted at) me aparesca la opción de cambiar de estado, este debe pedir un comment y seguir el siguiente flujo: un estado en Pendiente no puede pasar a ser uno Resuelto tiene que ir de Pendiente a En Proceso a Resuelto
- El usuario que no es ni Admin ni Technician no tiene el drag and drop de las columnas
- al realizar el drag an drop al realizar el drop en caso de cambiar de columna o estado se sigue el mismo flujo de cambio como con el card, es decir no saltarse pasos y pedir comentarios
---
## Prompt 2
### Descripción
Corrección del despliegue en Azure Static Web Apps mediante la configuración del runtime y la implementación de un proxy para conectar el frontend con el backend. Prompt reconstruido a partir de los cambios de `Fix Deployment`.
### Prompt

Quiero que corrijas la conexión del frontend con el backend en el despliegue de Azure Static Web Apps y mantengas el mismo funcionamiento en desarrollo local.

Requisitos:
- Configurar el frontend para utilizar `/api` como URL base de las peticiones.
- En desarrollo local, configurar el proxy de Vite para reenviar las peticiones al backend definido en `API_PROXY_TARGET`.
- En Azure, implementar una Azure Function dentro de `api/` que actúe como proxy y lea `API_PROXY_TARGET` desde las variables de entorno de Azure Static Web Apps.
- Utilizar `API_PROXY_TARGET` como el origen del backend, sin incluir `/api`, y conservar la ruta y los parámetros de cada petición al reenviarla.
- Conservar el método HTTP, el cuerpo, el token Bearer y el estado y contenido de la respuesta del backend.
- Crear `public/staticwebapp.config.json` con `platform.apiRuntime` configurado en `node:22` y ajustar el workflow para desplegar el frontend desde `dist` y la API desde `api`.
- Validar la configuración del destino y controlar los errores del proxy: devolver `503` si la configuración es inválida, `502` si falla la conexión y `504` si el backend supera el tiempo de espera.
- Actualizar `.env.example` y documentar la configuración necesaria para desarrollo local y Azure, diferenciando las variables de compilación del frontend de las variables de ejecución de la API.
- Agregar pruebas del reenvío de peticiones y del manejo de errores, y verificar el build, el lint y las pruebas del proyecto.

---
## Prompt 3
### Descripción
Corrección de los errores `401` en las peticiones autenticadas a través del proxy de Azure Static Web Apps, conservando el token Bearer de la aplicación. Prompt reconstruido a partir de los cambios de `Fix auth queries`.
### Prompt

Quiero que corrijas las peticiones autenticadas que devuelven `401` después de iniciar sesión cuando el frontend utiliza el proxy de Azure Static Web Apps.

Azure Static Web Apps utiliza el encabezado `Authorization` para comunicarse con la función y puede sustituir el token de la aplicación. Ajusta el envío y la recuperación del token para que el backend reciba la credencial correcta.

Requisitos:
- Mantener el encabezado `Authorization: Bearer <token>` en las peticiones autenticadas del frontend.
- Cuando la URL base sea relativa y las peticiones pasen por el proxy, enviar también el token en el encabezado `X-Tickets-Authorization`.
- Cuando se utilice una URL absoluta para llamar directamente al backend, enviar el token únicamente en `Authorization`.
- En el proxy, recuperar primero `X-Tickets-Authorization` y utilizar `Authorization` como alternativa cuando el encabezado propio no esté presente.
- Reenviar la credencial recuperada al backend como `Authorization: Bearer <token>`.
- Agregar pruebas que verifiquen los encabezados del frontend para las llamadas relativas y absolutas, y que el proxy priorice el token de la aplicación cuando ambos encabezados estén presentes.
- Actualizar la documentación de conexión al backend para explicar la causa de los errores `401` y el funcionamiento de la solución.
- Ejecutar las pruebas correspondientes para verificar que el token llegue correctamente al backend.

---
