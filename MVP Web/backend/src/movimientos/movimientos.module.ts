import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from '../inventario/inventario.entity.js';
import { Producto } from '../productos/producto.entity.js';
import { Ubicacion } from '../ubicaciones/ubicacion.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { DetalleMovimiento } from './detalle-movimiento.entity.js';
import { Movimiento } from './movimiento.entity.js';
import { MovimientosController } from './movimientos.controller.js';
import { MovimientosService } from './movimientos.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Movimiento,
      DetalleMovimiento,
      Inventario,
      Producto,
      Ubicacion,
      Usuario,
    ]),
  ],
  controllers: [MovimientosController],
  providers: [MovimientosService],
})
export class MovimientosModule {}
