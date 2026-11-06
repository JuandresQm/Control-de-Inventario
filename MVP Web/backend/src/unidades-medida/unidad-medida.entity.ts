import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('unidades_medida')
export class UnidadMedida {
  @PrimaryGeneratedColumn({ name: 'unidad_id' })
  unidadId: number;

  @Column({ unique: true, length: 20 })
  nombre: string;
}
