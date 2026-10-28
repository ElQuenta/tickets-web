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