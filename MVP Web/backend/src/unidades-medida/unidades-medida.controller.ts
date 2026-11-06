import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto.js';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto.js';
import { UnidadMedida } from './unidad-medida.entity.js';
import { UnidadesMedidaService } from './unidades-medida.service.js';

@Controller('unidades-medida')
export class UnidadesMedidaController {
  constructor(private readonly service: UnidadesMedidaService) {}

  @Get()
  findAll(): Promise<UnidadMedida[]> {
    return this.service.findAll();
  }

  @Post()
  create(@Body() dto: CreateUnidadMedidaDto): Promise<UnidadMedida> {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUnidadMedidaDto): Promise<UnidadMedida> {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(Number(id));
  }
}
