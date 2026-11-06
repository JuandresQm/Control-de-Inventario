import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Categoria } from '../categorias/categoria.entity.js';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'producto_id' })
  productoId: number;

  @Column({ unique: true, length: 50 })
  sku: string;

  @Column({ length: 150 })
  nombre: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria | null;

  @RelationId((producto: Producto) => producto.categoria)
  categoriaId: number | null;

  @Column({ name: 'unidad_medida', length: 20 })
  unidadMedida: string;

  @Column({ name: 'stock_minimo', type: 'integer', default: 0 })
  stockMinimo: number;

  @Column({ name: 'stock_actual', type: 'integer', default: 0 })
  stockActual: number;
}