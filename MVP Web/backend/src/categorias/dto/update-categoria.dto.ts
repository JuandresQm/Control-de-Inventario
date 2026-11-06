import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;
}
