import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('inventario')
@Unique(['productoId', 'ubicacionId'])
export class Inventario {
  @PrimaryGeneratedColumn({ name: 'inventario_id' })
  inventarioId: number;

  @Column({ name: 'producto_id' })
  productoId: number;

  @Column({ name: 'ubicacion_id' })
  ubicacionId: number;

  @Column({ name: 'stock_actual', default: 0 })
  stockActual: number;

  @Column({ name: 'ultima_actualizacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  ultimaActualizacion: Date;
}