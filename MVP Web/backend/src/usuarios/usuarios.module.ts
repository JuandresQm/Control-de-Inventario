import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../roles/rol.entity.js';
import { Usuario } from './usuario.entity.js';
import { UsuariosController } from './usuarios.controller.js';
import { UsuariosService } from './usuarios.service.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Rol]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'cambia-esta-clave-en-produccion',
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, JwtAuthGuard, RolesGuard],
  exports: [UsuariosService],
})
export class UsuariosModule {}
