import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Usuario } from './usuario.entity.js';
import { UsuariosService } from './usuarios.service.js';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  findAll(): Promise<Usuario[]> {
    return this.usuariosService.findAll();
  }

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUsuarioDto): Promise<Usuario> {
    return this.usuariosService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usuariosService.remove(Number(id));
  }
}
