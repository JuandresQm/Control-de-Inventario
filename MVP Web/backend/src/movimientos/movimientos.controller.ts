import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AuthenticatedRequest } from '../auth/jwt-auth.guard.js';
import { CreateMovimientoDto } from './dto/create-movimiento.dto.js';
import { Movimiento } from './movimiento.entity.js';
import { MovimientosService } from './movimientos.service.js';

@Controller('movimientos')
@UseGuards(JwtAuthGuard)
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Get()
  findAll(): Promise<Movimiento[]> {
    return this.movimientosService.findAll();
  }

  @Post()
  create(
    @Body() createMovimientoDto: CreateMovimientoDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<Movimiento> {
    return this.movimientosService.create(createMovimientoDto, request.user.sub);
  }
}
