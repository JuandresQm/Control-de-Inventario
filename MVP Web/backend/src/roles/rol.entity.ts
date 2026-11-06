import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity.js';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn({ name: 'rol_id' })
  rolId: number;

  @Column({ unique: true, length: 50 })
  nombre: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}

export enum RolNombre {
  ADMINISTRADOR = 'administrador',
  OPERADOR = 'operador',
}
