import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './roles.guard.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { UsuariosModule } from '../usuarios/usuarios.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../roles/rol.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';

@Module({
  imports: [
    UsuariosModule,
    TypeOrmModule.forFeature([Rol, Usuario]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'cambia-esta-clave-en-produccion',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [JwtModule, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
