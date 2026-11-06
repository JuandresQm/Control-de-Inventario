import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Producto } from '../productos/producto.entity.js';
import { Ubicacion } from '../ubicaciones/ubicacion.entity.js';
import { Movimiento } from './movimiento.entity.js';

@Entity('detalles_movimiento')
export class DetalleMovimiento {
  @PrimaryGeneratedColumn({ name: 'detalle_id' })
  detalleId: number;

  @ManyToOne(() => Movimiento, (movimiento) => movimiento.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'movimiento_id' })
  movimiento: Movimiento;

  @ManyToOne(() => Producto, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto | null;

  @Column()
  cantidad: number;

  @Column({
    name: 'stock_anterior',
    type: 'integer',
    default: 0,
  })
  stockAnterior: number;

  @Column({
    name: 'stock_nuevo',
    type: 'integer',
    default: 0,
  })
  stockNuevo: number;

  @ManyToOne(() => Ubicacion, { nullable: true })
  @JoinColumn({ name: 'ubicacion_id' })
  ubicacion: Ubicacion | null;
}
