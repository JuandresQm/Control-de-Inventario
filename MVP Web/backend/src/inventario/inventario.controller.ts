import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActualizarStockDto } from './dto/actualizar-stock.dto.js';
import { InventarioService } from './inventario.service.js';
import { Inventario } from './inventario.entity.js';

@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Get()
  async findAll(): Promise<Inventario[]> {
    return await this.inventarioService.findAll();
  }

  @Post()
  async actualizar(
    @Body() body: ActualizarStockDto,
  ): Promise<Inventario> {
    return this.inventarioService.actualizarStock(body);
  }
}