import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Rol } from '../roles/rol.entity.js';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 255, select: false })
  clave: string;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { nullable: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol | null;

  @Column({ default: true })
  estado: boolean;
}
