import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity.js';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  async findAll(): Promise<Inventario[]> {
    return await this.inventarioRepository.find();
  }

  async actualizarStock(productoId: number, ubicacionId: number, cantidad: number): Promise<Inventario> {
    let stockItem = await this.inventarioRepository.findOne({
      where: { productoId, ubicacionId },
    });

    if (stockItem) {
      stockItem.stockActual = cantidad;
      stockItem.ultimaActualizacion = new Date();
    } else {
      stockItem = this.inventarioRepository.create({
        productoId,
        ubicacionId,
        stockActual: cantidad,
      });
    }

    return await this.inventarioRepository.save(stockItem);
  }
}