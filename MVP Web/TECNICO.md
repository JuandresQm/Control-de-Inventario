Control de inventario
JuliamCorpLLC

Este MVP implementa una solución de gestión de inventario basada en una arquitectura moderna de microservicios contenerizados, cuyo objetivo principal es garantizar el control de las operaciones del almacén mediante una infraestructura robusta, segura y fácil de desplegar. El backend se encuentra desarrollado en NestJS (TypeScript) bajo un patrón modular, utilizando TypeORM para el mapeo objeto-relacional, control de acceso por roles y registro histórico detallado de los movimientos de almacén, mientras que el frontend opera con React, Vite y TypeScript a través de una interfaz reactiva ligera empaquetada mediante Nginx para entornos de producción. La identidad y seguridad vinculan obligatoriamente a los usuarios a un rol de administrador u operador para restringir acciones sensibles, contemplando de forma temporal y acotada un acceso predeterminado con credenciales admin/admin para agilizar las pruebas técnicas, manteniendo el resto de cuentas debidamente hasheadas con bcrypt.

El sistema estructura sus operaciones mediante un flujo integral de catálogos, almacenamiento y movimientos que configuran previamente las categorías, unidades de medida y ubicaciones físicas con códigos de estante únicos para relacionar con precisión quirúrgica el inventario por locación, permitiendo que cada entrada, salida o ajuste físico genere una cabecera estructurada en la tabla movimientos vinculada de manera imperativa a un documento de respaldo y un usuario responsable, acompañada a su vez de un registro detallado que audita en tiempo real el stock por ítem, garantizando así una trazabilidad impecable de toda la mercancía; por su parte, el perfil del administrador mantiene el control centralizado y estricto para gestionar de forma segura los usuarios, los roles y los respaldos periódicos de los datos críticos del almacén, mientras que la interfaz se complementa con filtros de búsqueda avanzados y validaciones de entrada robustas que evitan errores operativos y optimizan de forma notable la experiencia de usuario en el día a día.

Guía de Despliegue en Entorno Docker (`docker-compose up`)
El despliegue está automatizado mediante un único archivo `docker-compose.yml` que orquesta los tres contenedores de forma secuencial (`postgres`, `backend`, `frontend`).

* Prerrequisitos
* Docker y Docker Compose instalados en el sistema operativo

* **Instrucciones de Puesta en Marcha**
* Clonar o situarse en la raíz del proyecto donde se encuentra el archivo `docker-compose.yml`
* Ejecutar el comando de despliegue en limpio:

docker compose down --volumes
docker compose up --build -d
* Ingresar a localhost:80
* Verificar el estado de los servicios mediante los puertos expuestos por defecto:
* Frontend: `http://localhost:5173`
* Backend (API REST): `http://localhost:3000`
* Base de Datos (PostgreSQL): `localhost:5433`

Formato archivo .ENV:
DB_HOST=postgres
DB_PORT=5433
DB_USER=usuario
DB_PASSWORD=contraseña
DB_NAME=base_de_datos


Propuesta Arquitectónica a Largo Plazo
Al evaluar la evolución del sistema hacia escenarios corporativos de alta escala, la discusión no gira en torno a qué arquitectura es "mejor" en términos absolutos, sino a qué modelo equilibra de manera eficiente la agilidad operativa con la madurez financiera. Los desarrollos a la medida destacan por su capacidad de amoldarse al milímetro a los procesos del negocio, ofreciendo un código bajo nuestro control, un consumo optimizado de recursos y la ventaja de no depender de licencias de terceros, sin embargo, exigen un esfuerzo continuo en mantenimiento y pueden volver compleja la construcción interna de módulos contables o de facturación si la empresa experimenta un crecimiento acelerado. Por su parte, las plataformas comerciales como SAP u Odoo entregan un ecosistema robusto de entrada, estandarizado a nivel financiero global y con módulos clave preconstruidos, no obstante, suelen imponer una rigidez operativa que fuerza a la empresa a adaptar sus flujos al software, acompañada de curvas de aprendizaje pronunciadas y costos elevados en consultoría e implementación.

Debido a esto la via más inteligente para escalar seria adoptar una estrategia híbrida. En lugar de forzar al negocio a elegir entre la rigidez de un ERP o el desgaste de reinventar la rueda en áreas contables, la propuesta consiste en preservar el núcleo de inventario a la medida para mantener la agilidad logística que la operación exige cotidianamente, mientras que la trazabilidad financiera y fiscal se delega a un ERP mediante integraciones por APIs RESTful seguras. De este modo, la empresa conserva la flexibilidad táctica en el día a día sin perder el respaldo formal que demandan los estándares corporativos a gran escala.