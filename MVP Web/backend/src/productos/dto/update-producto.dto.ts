import { IsInt, IsNotEmpty, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  nombre: string;

  @IsInt()
  @Min(1)
  categoriaId: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  unidadMedida: string;

  @IsInt()
  @Min(0)
  stockMinimo: number;
}
