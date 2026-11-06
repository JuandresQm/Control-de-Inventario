import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventarioController } from './inventario.controller.js';
import { InventarioService } from './inventario.service.js';
import { Inventario } from './inventario.entity.js';
import { Producto } from '../productos/producto.entity.js';
import { Ubicacion } from '../ubicaciones/ubicacion.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Inventario, Producto, Ubicacion])],
  controllers: [InventarioController],
  providers: [InventarioService],
})
export class InventarioModule {}