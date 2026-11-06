import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  clave?: string;

  @IsInt()
  @Min(1)
  rolId: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
