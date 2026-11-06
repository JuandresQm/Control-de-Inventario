import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateDetalleMovimientoDto {
  @IsInt()
  @Min(1)
  productoId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  cantidad: number;

  @IsInt()
  @Min(1)
  ubicacionId: number;
}
