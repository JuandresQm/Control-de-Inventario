import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from '../productos/producto.entity.js';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'categoria_id' })
  categoriaId: number;

  @Column({ length: 100 })
  nombre: string;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
