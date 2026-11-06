import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUbicacionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  codigoEstante: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  descripcion?: string;
}
