import { Entity, PrimaryGeneratedColumn, Column, Unique, JoinColumn, ManyToOne } from 'typeorm';
import { Producto } from '../productos/producto.entity.js';

@Entity('inventario')
@Unique(['productoId', 'ubicacionId'])
export class Inventario {
  @PrimaryGeneratedColumn({ name: 'inventario_id' })
  inventarioId: number;

  @Column({ name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ name: 'ubicacion_id' })
  ubicacionId: number;

  @Column({ name: 'stock_actual', type: 'integer', default: 0 })
  stockActual: number;

  @Column({ name: 'ultima_actualizacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  ultimaActualizacion: Date;
}