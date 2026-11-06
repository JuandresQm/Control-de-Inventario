import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUnidadMedidaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  nombre: string;
}
