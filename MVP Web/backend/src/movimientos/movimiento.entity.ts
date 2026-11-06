import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity.js';
import { DetalleMovimiento } from './detalle-movimiento.entity.js';
import { MovimientoTipo } from './movimiento-tipo.enum.js';

@Entity('movimientos')
export class Movimiento {
  @PrimaryGeneratedColumn({ name: 'movimiento_id' })
  movimientoId: number;

  @Column({
    name: 'tipo_movimiento',
    type: 'enum',
    enum: MovimientoTipo,
    enumName: 'tipo_mov',
  })
  tipoMovimiento: MovimientoTipo;

  @Column({ name: 'documento_id', type: 'varchar', length: 100, nullable: true })
  documentoId: string | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => "timezone('America/Caracas', CURRENT_TIMESTAMP)",
  })
  createdAt: Date;

  @OneToMany(() => DetalleMovimiento, (detalle) => detalle.movimiento, {
    cascade: false,
  })
  detalles: DetalleMovimiento[];
}
