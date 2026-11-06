import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { MovimientoTipo } from '../movimiento-tipo.enum.js';
import { CreateDetalleMovimientoDto } from './create-detalle-movimiento.dto.js';

export class CreateMovimientoDto {
  @IsEnum(MovimientoTipo)
  tipoMovimiento: MovimientoTipo;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  documentoId?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  observaciones?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleMovimientoDto)
  detalles: CreateDetalleMovimientoDto[];
}
