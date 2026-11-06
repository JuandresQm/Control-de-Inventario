import { Controller, Get, Post, Body } from '@nestjs/common';
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
    @Body() body: { productoId: number; ubicacionId: number; cantidad: number },
  ): Promise<Inventario> {
    return await this.inventarioService.actualizarStock(
      body.productoId,
      body.ubicacionId,
      body.cantidad,
    );
  }
}