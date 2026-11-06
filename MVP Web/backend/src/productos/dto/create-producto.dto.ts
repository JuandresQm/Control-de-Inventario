import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class CreateProductoDto {
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

  @IsOptional()
  @IsInt()
  @Min(0)
  stockMinimo?: number;
}
