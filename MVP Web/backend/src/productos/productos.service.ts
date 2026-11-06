import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity.js';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async findAll(): Promise<Producto[]> {
    return await this.productoRepository.find();
  }

  async create(productData: Partial<Producto>): Promise<Producto> {
    const nuevoProducto = this.productoRepository.create(productData);
    return await this.productoRepository.save(nuevoProducto);
  }
}