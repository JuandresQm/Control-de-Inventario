import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUnidadMedidaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  nombre: string;
}
