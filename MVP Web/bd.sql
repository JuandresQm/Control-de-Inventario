-- Creación de tipos
CREATE TYPE tipo_mov AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE_FISICO');

-- Roles y Usuarios
CREATE TABLE roles (
    rol_id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    clave VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(rol_id),
    estado BOOLEAN DEFAULT TRUE
);

-- Catálogo
CREATE TABLE categorias (
    categoria_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE productos (
    producto_id SERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    categoria_id INTEGER REFERENCES categorias(categoria_id),
    unidad_medida VARCHAR(20) NOT NULL,
    stock_minimo INTEGER DEFAULT 0
);

-- Ubicaciones físicas
CREATE TABLE ubicaciones (
    ubicacion_id SERIAL PRIMARY KEY,
    codigo_estante VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Stock actual por ubicación
CREATE TABLE inventario (
    inventario_id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(producto_id),
    ubicacion_id INTEGER REFERENCES ubicaciones(ubicacion_id),
    stock_actual INTEGER NOT NULL DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_producto_ubicacion UNIQUE (producto_id, ubicacion_id)
);

-- Movimientos
CREATE TABLE movimientos (
    movimiento_id SERIAL PRIMARY KEY,
    tipo_movimiento tipo_mov NOT NULL,
    documento_id VARCHAR(100),
    usuario_id INTEGER REFERENCES usuarios(usuario_id),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE detalles_movimiento (
    detalle_id SERIAL PRIMARY KEY,
    movimiento_id INTEGER REFERENCES movimientos(movimiento_id) ON DELETE CASCADE,
    producto_id INTEGER REFERENCES productos(producto_id),
    cantidad INTEGER NOT NULL,
    ubicacion_id INTEGER REFERENCES ubicaciones(ubicacion_id)
);