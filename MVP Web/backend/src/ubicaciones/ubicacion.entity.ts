import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ubicaciones')
export class Ubicacion {
  @PrimaryGeneratedColumn({ name: 'ubicacion_id' })
  ubicacionId: number;

  @Column({ name: 'codigo_estante', unique: true, length: 50 })
  codigoEstante: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;
}
