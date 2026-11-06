import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Like, Repository } from 'typeorm';
import { Categoria } from '../categorias/categoria.entity.js';
import { DetalleMovimiento } from '../movimientos/detalle-movimiento.entity.js';
import { Inventario } from '../inventario/inventario.entity.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { Producto } from './producto.entity.js';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({ relations: { categoria: true } });
  }

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const categoria = await this.categoriaRepository.findOneBy({
      categoriaId: createProductoDto.categoriaId,
    });
    if (!categoria) {
      throw new NotFoundException(
        `No existe la categoría con el id ${createProductoDto.categoriaId}`,
      );
    }

    const prefix = `${this.toSkuPart(categoria.nombre)}${this.toSkuPart(createProductoDto.nombre)}`;
    const previousProducts = await this.productoRepository.find({
      select: { sku: true },
      where: { sku: Like(`${prefix}-%`) },
      order: { sku: 'DESC' },
    });
    const nextNumber = previousProducts.reduce((max, product) => {
      const suffix = Number(product.sku.slice(-3));
      return Number.isInteger(suffix) ? Math.max(max, suffix) : max;
    }, 0) + 1;
    if (nextNumber > 999) {
      throw new ConflictException(`Se agotaron los SKU para el prefijo ${prefix}`);
    }

    const nuevoProducto = this.productoRepository.create({
      sku: `${prefix}-${String(nextNumber).padStart(3, '0')}`,
      nombre: createProductoDto.nombre,
      unidadMedida: createProductoDto.unidadMedida,
      stockMinimo: createProductoDto.stockMinimo ?? 0,
      categoria,
    });
    return this.productoRepository.save(nuevoProducto);
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { productoId: id },
      relations: { categoria: true },
    });
    if (!producto) {
      throw new NotFoundException(`No existe el producto con el id ${id}`);
    }

    const categoria = await this.categoriaRepository.findOneBy({
      categoriaId: dto.categoriaId,
    });
    if (!categoria) {
      throw new NotFoundException(
        `No existe la categoría con el id ${dto.categoriaId}`,
      );
    }

    Object.assign(producto, {
      nombre: dto.nombre,
      unidadMedida: dto.unidadMedida,
      stockMinimo: dto.stockMinimo,
      categoria,
    });
    return this.productoRepository.save(producto);
  }

  async remove(id: number): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const producto = await manager.getRepository(Producto).findOneBy({
        productoId: id,
      });
      if (!producto) {
        throw new NotFoundException(`No existe el producto con el id ${id}`);
      }

      await manager
        .getRepository(DetalleMovimiento)
        .createQueryBuilder()
        .delete()
        .where('producto_id = :id', { id })
        .execute();
      await manager.getRepository(Inventario).delete({ productoId: id });
      await manager.getRepository(Producto).delete(id);
    });
  }

  private toSkuPart(value: string): string {
    const normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase();
    if (normalized.length < 3) {
      throw new BadRequestException(
        'La categoría y el nombre deben contener al menos tres letras para generar el SKU',
      );
    }
    return normalized.slice(0, 3);
  }
}