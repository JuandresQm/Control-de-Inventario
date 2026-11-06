import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UbicacionesController } from './ubicaciones.controller.js';
import { Ubicacion } from './ubicacion.entity.js';
import { UbicacionesService } from './ubicaciones.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Ubicacion])],
  controllers: [UbicacionesController],
  providers: [UbicacionesService],
  exports: [UbicacionesService],
})
export class UbicacionesModule {}
