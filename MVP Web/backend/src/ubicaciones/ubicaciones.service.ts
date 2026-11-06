import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUbicacionDto } from './dto/create-ubicacion.dto.js';
import { Ubicacion } from './ubicacion.entity.js';
import { UpdateUbicacionDto } from './dto/update-ubicacion.dto.js';

@Injectable()
export class UbicacionesService {
  constructor(
    @InjectRepository(Ubicacion)
    private readonly ubicacionRepository: Repository<Ubicacion>,
  ) {}

  async findAll(): Promise<Ubicacion[]> {
    return this.ubicacionRepository.find();
  }

  async create(createUbicacionDto: CreateUbicacionDto): Promise<Ubicacion> {
    const ubicacion = this.ubicacionRepository.create(createUbicacionDto);
    return this.ubicacionRepository.save(ubicacion);
  }

  async update(id: number, dto: UpdateUbicacionDto): Promise<Ubicacion> {
    const ubicacion = await this.ubicacionRepository.findOneBy({ ubicacionId: id });
    if (!ubicacion) throw new NotFoundException(`No existe la ubicación con el id ${id}`);
    Object.assign(ubicacion, dto);
    return this.ubicacionRepository.save(ubicacion);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ubicacionRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`No existe la ubicación con el id ${id}`);
  }
}
