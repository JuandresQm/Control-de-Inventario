import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller.js';
import { Rol } from './rol.entity.js';
import { RolesService } from './roles.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Rol]), AuthModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
