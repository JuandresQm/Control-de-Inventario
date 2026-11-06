import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productos/producto.entity.js';
import { Ubicacion } from '../ubicaciones/ubicacion.entity.js';
import { ActualizarStockDto } from './dto/actualizar-stock.dto.js';
import { Inventario } from './inventario.entity.js';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
  ) {}

  async findAll(): Promise<Inventario[]> {
    return await this.inventarioRepository.find();
  }

  async actualizarStock(dto: ActualizarStockDto): Promise<Inventario> {
    const { productoId, ubicacionId, cantidad } = dto;
    const [producto, ubicacion] = await Promise.all([
      this.productoRepository.findOneBy({ productoId }),
      this.ubicacionRepository.findOneBy({ ubicacionId }),
    ]);

    if (!producto) {
      throw new NotFoundException(`No existe el producto con el id ${productoId}`);
    }
    if (!ubicacion) {
      throw new NotFoundException(
        `No existe la ubicación con el id ${ubicacionId}`,
      );
    }

    let stockItem = await this.inventarioRepository.findOne({
      where: { productoId, ubicacionId },
    });

    if (stockItem) {
      stockItem.stockActual = cantidad;
    } else {
      stockItem = this.inventarioRepository.create({
        productoId,
        ubicacionId,
        stockActual: cantidad,
      });
    }

    stockItem.ultimaActualizacion = new Date();
    return this.inventarioRepository.save(stockItem);
  }
}