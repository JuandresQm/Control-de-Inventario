Diagnóstico Inicial: Juliam Corp LLC.

Problemática: Debido a la falta de un sistema centralizado y un proceso estandarizado, con el uso de multiples archivos excel sin regulación, se ha generado una crisis operativa de control de inventarios en el almacén central. La desincronización de los inventarios hace que se pierda la relación entre lo real y lo registrado. Esto genera que no se sepa a ciencia cierta que productos hay que restockear generando asi una pérdida de ventas e insatisfacción de clientes, llegando al punto de colapsar la linea de despachos. Se tiene menos de una semana para solventar la situación.

Causas de la problemática:
El nuevo personal creó unos archivos de Excel sin autorización para llevar un control del inventario, rompiendo asi la sincronización de los datos. Lo que llevó a que el almacén quedara sin un registro confiable. Esta situación empeoró por la ausencia de un proceso claro y de guías obligatorias. Cada operador manejó las entradas y salidas a su manera, sin control ni normas. Se usaron archivos Excel improvisados con macros que no tenían las validaciones necesarias ni fueron probadas adecuadamente. Esto permitió que los registros se alteraran o se corrompieran fácilmente. Al no contar con una inducción correcta para los nuevos empleados, ni supervisión en el uso de las herramientas tecnológicas se perdió completamente el propósito del sistema original.

Procesos de negocios más impactados:
Control de inventarios y trazabilidad, al perderse por completo la sincronización entre el stock físico real y lo registrado, no es posible saber con exactitud las necesidades de restock.
Gestión de despachos, donde los tiempos de espera para los clientes se alargaron generando un cuello de botella para la salida de productos.
Ventas y relación comercial, el desgaste de la satisfacción del cliente y la pérdida de ventas diarias provocadas.

Estructura necesaria:
Debido al tiempo que se tiene para solventar el problema, tomando en cuenta que es para implementar una solución de contingencia, esta estructura está pensada para que el personal actual y el nuevo puedan registrar conteos y despachos de forma intuitiva para recuperar el control del almacén. La arquitectura relacional está diseñada para garantizar que se pueda migrar a una solución más elaborada.

Catálogo de Productos:
SKU_ID (PK)
Nombre de Producto
Categoría
Unidad de Medida

Auditoría y Stock Físico:
Auditoría_ID (PK)
SKU_ID (FK)
Ubicación en el almacén
Stock
Fecha y hora del conteo

Registro de Entradas:
Entrada ID (PK)
Recepción ID (Número de lote)
SKU_ID (FK)
Cantidad recibida
Fecha de recepción

Registro de Salidas:
Salida ID (PK)
Orden de compra ID (Número de factura del cliente)
SKU_ID (FK)
Cantidad despachada
Fecha de despacho