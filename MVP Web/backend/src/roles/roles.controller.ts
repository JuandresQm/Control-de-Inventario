import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { Rol } from './rol.entity.js';
import { RolesService } from './roles.service.js';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll(): Promise<Rol[]> {
    return this.rolesService.findAll();
  }

  @Post()
  create(@Body() createRolDto: CreateRolDto): Promise<Rol> {
    return this.rolesService.create(createRolDto);
  }
}
