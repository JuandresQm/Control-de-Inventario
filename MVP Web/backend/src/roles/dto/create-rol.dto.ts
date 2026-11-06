import { IsEnum, IsNotEmpty } from 'class-validator';
import { RolNombre } from '../rol.entity.js';

export class CreateRolDto {
  @IsEnum(RolNombre)
  @IsNotEmpty()
  nombre: RolNombre;
}
