import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';
import { Producto } from './producto.entity.js';
import { Categoria } from '../categorias/categoria.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, Categoria])],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}