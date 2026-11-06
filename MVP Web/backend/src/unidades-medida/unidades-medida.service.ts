import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto.js';
import { UnidadMedida } from './unidad-medida.entity.js';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto.js';

@Injectable()
export class UnidadesMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private readonly repository: Repository<UnidadMedida>,
  ) {}

  findAll(): Promise<UnidadMedida[]> {
    return this.repository.find({ order: { nombre: 'ASC' } });
  }

  async create(dto: CreateUnidadMedidaDto): Promise<UnidadMedida> {
    const exists = await this.repository.findOneBy({ nombre: dto.nombre });
    if (exists) {
      throw new ConflictException(`La unidad ${dto.nombre} ya existe`);
    }
    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateUnidadMedidaDto): Promise<UnidadMedida> {
    const item = await this.repository.findOneBy({ unidadId: id });
    if (!item) throw new NotFoundException(`No existe la unidad con el id ${id}`);
    item.nombre = dto.nombre;
    return this.repository.save(item);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (!result.affected) throw new NotFoundException(`No existe la unidad con el id ${id}`);
  }
}
