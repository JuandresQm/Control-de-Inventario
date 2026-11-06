import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUbicacionDto {
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
