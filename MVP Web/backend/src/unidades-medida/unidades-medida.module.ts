import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnidadesMedidaController } from './unidades-medida.controller.js';
import { UnidadMedida } from './unidad-medida.entity.js';
import { UnidadesMedidaService } from './unidades-medida.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([UnidadMedida])],
  controllers: [UnidadesMedidaController],
  providers: [UnidadesMedidaService],
  exports: [UnidadesMedidaService],
})
export class UnidadesMedidaModule {}
