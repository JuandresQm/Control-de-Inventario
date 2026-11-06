import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'producto_id' })
  productoId: number;

  @Column({ unique: true, length: 50 })
  sku: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ name: 'categoria_id' })
  categoriaId: number;

  @Column({ name: 'unidad_medida', length: 20 })
  unidadMedida: string;

  @Column({ name: 'stock_minimo', default: 0 })
  stockMinimo: number;
}