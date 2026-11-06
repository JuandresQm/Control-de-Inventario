import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Inventario } from '../inventario/inventario.entity.js';
import { Producto } from '../productos/producto.entity.js';
import { Ubicacion } from '../ubicaciones/ubicacion.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { CreateMovimientoDto } from './dto/create-movimiento.dto.js';
import { DetalleMovimiento } from './detalle-movimiento.entity.js';
import { MovimientoTipo } from './movimiento-tipo.enum.js';
import { Movimiento } from './movimiento.entity.js';

@Injectable()
export class MovimientosService {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(): Promise<Movimiento[]> {
    return this.dataSource.getRepository(Movimiento).find({
      order: { createdAt: 'DESC' },
      relations: {
        usuario: true,
        detalles: {
          producto: true,
          ubicacion: true,
        },
      },
    });
  }

  async create(
    createMovimientoDto: CreateMovimientoDto,
    usuarioId: number,
  ): Promise<Movimiento> {
    return this.dataSource.transaction(async (manager) => {
      const usuario = await this.findRequired(
        manager,
        Usuario,
        usuarioId,
        'usuario',
      );

      const movimiento = manager.getRepository(Movimiento).create({
        tipoMovimiento: createMovimientoDto.tipoMovimiento,
        documentoId: createMovimientoDto.documentoId ?? null,
        observaciones: createMovimientoDto.observaciones ?? null,
        usuario,
      });
      const savedMovimiento = await manager
        .getRepository(Movimiento)
        .save(movimiento);

      const detalles: DetalleMovimiento[] = [];
      for (const detalleDto of createMovimientoDto.detalles) {
        if (
          createMovimientoDto.tipoMovimiento !== MovimientoTipo.AJUSTE_FISICO &&
          detalleDto.cantidad < 1
        ) {
          throw new BadRequestException(
            'La cantidad debe ser mayor que cero para entradas y salidas',
          );
        }

        const [producto, ubicacion] = await Promise.all([
          this.findRequired(manager, Producto, detalleDto.productoId, 'producto'),
          this.findRequired(
            manager,
            Ubicacion,
            detalleDto.ubicacionId,
            'ubicación',
          ),
        ]);

        const stock = await this.updateStock(
          manager,
          createMovimientoDto.tipoMovimiento,
          producto,
          detalleDto.ubicacionId,
          detalleDto.cantidad,
        );

        detalles.push(
          manager.getRepository(DetalleMovimiento).create({
            movimiento: savedMovimiento,
            producto,
            ubicacion,
            cantidad: detalleDto.cantidad,
            stockAnterior: stock.anterior,
            stockNuevo: stock.nuevo,
          }),
        );
      }

      await manager.getRepository(DetalleMovimiento).save(detalles);
      return manager.getRepository(Movimiento).findOneOrFail({
        where: { movimientoId: savedMovimiento.movimientoId },
        relations: {
          usuario: true,
          detalles: { producto: true, ubicacion: true },
        },
      });
    });
  }

  private async updateStock(
    manager: EntityManager,
    tipo: MovimientoTipo,
    producto: Producto,
    ubicacionId: number,
    cantidad: number,
  ): Promise<{ anterior: number; nuevo: number }> {
    const repository = manager.getRepository(Inventario);
    let inventario = await repository.findOne({
      where: { productoId: producto.productoId, ubicacionId },
      lock: { mode: 'pessimistic_write' },
    });

    const stockUbicacionAnterior = inventario?.stockActual ?? 0;
    const stockProductoAnterior = producto.stockActual;
    if (!inventario) {
      if (tipo === MovimientoTipo.SALIDA) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${producto.productoId} en la ubicación ${ubicacionId}`,
        );
      }

      inventario = repository.create({
        productoId: producto.productoId,
        ubicacionId,
        stockActual: cantidad,
      });
    } else if (tipo === MovimientoTipo.ENTRADA) {
      inventario.stockActual += cantidad;
    } else if (tipo === MovimientoTipo.SALIDA) {
      if (inventario.stockActual < cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para el producto ${producto.productoId} en la ubicación ${ubicacionId}`,
        );
      }
      inventario.stockActual -= cantidad;
    } else {
      inventario.stockActual = cantidad;
    }

    inventario.ultimaActualizacion = new Date();
    await repository.save(inventario);
    const stockNuevo = inventario.stockActual;
    producto.stockActual += stockNuevo - stockUbicacionAnterior;
    await manager.getRepository(Producto).save(producto);
    return { anterior: stockProductoAnterior, nuevo: producto.stockActual };
  }

  private async findRequired<T extends object>(
    manager: EntityManager,
    entity: new () => T,
    id: number,
    name: string,
  ): Promise<T> {
    const record = await manager.getRepository(entity).findOneBy({
      [this.getIdField(entity)]: id,
    } as never);

    if (!record) {
      throw new NotFoundException(`No existe el ${name} con el id ${id}`);
    }
    return record;
  }

  private getIdField(entity: new () => object): string {
    if (entity === Usuario) return 'usuarioId';
    if (entity === Producto) return 'productoId';
    return 'ubicacionId';
  }
}
