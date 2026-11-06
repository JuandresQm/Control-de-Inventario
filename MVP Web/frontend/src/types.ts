export type MovimientoTipo = 'ENTRADA' | 'SALIDA' | 'AJUSTE_FISICO'

export interface Rol {
  rolId: number
  nombre: string
}

export interface Usuario {
  usuarioId: number
  nombre: string
  estado: boolean
  rol?: Rol | null
}

export interface Categoria {
  categoriaId: number
  nombre: string
}

export interface UnidadMedida {
  unidadId: number
  nombre: string
}

export interface Ubicacion {
  ubicacionId: number
  codigoEstante: string
  descripcion: string | null
}

export interface Producto {
  productoId: number
  sku: string
  nombre: string
  unidadMedida: string
  stockMinimo: number
  stockActual: number
  categoria?: Categoria | null
}

export interface Inventario {
  inventarioId: number
  productoId: number
  ubicacionId: number
  stockActual: number
  ultimaActualizacion: string
}

export interface DetalleMovimiento {
  detalleId: number
  cantidad: number
  stockAnterior: number
  stockNuevo: number
  producto?: Producto | null
  ubicacion?: Ubicacion | null
}

export interface Movimiento {
  movimientoId: number
  tipoMovimiento: MovimientoTipo
  documentoId: string | null
  observaciones: string | null
  createdAt: string
  usuario?: Usuario | null
  detalles: DetalleMovimiento[]
}
