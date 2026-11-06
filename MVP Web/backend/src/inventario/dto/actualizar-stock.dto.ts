import { IsInt, Min } from 'class-validator';

export class ActualizarStockDto {
  @IsInt()
  @Min(1)
  productoId: number;

  @IsInt()
  @Min(1)
  ubicacionId: number;

  @IsInt()
  @Min(0)
  cantidad: number;
}
