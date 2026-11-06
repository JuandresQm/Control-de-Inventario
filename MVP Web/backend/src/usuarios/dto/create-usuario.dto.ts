import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  clave: string;

  @IsInt()
  @Min(1)
  rolId: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
