import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProductosService } from './productos.service.js';
import { Producto } from './producto.entity.js';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  async findAll(): Promise<Producto[]> {
    return await this.productosService.findAll();
  }

  @Post()
  async create(@Body() body: Partial<Producto>): Promise<Producto> {
    return await this.productosService.create(body);
  }
}