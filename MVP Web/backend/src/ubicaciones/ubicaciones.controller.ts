import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto.js';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto.js';
import { Ubicacion } from './ubicacion.entity.js';
import { UbicacionesService } from './ubicaciones.service.js';

@Controller('ubicaciones')
export class UbicacionesController {
  constructor(private readonly ubicacionesService: UbicacionesService) {}

  @Get()
  findAll(): Promise<Ubicacion[]> {
    return this.ubicacionesService.findAll();
  }

  @Post()
  create(@Body() createUbicacionDto: CreateUbicacionDto): Promise<Ubicacion> {
    return this.ubicacionesService.create(createUbicacionDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUbicacionDto): Promise<Ubicacion> {
    return this.ubicacionesService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ubicacionesService.remove(Number(id));
  }
}
