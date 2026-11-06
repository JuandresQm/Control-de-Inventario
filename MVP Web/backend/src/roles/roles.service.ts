import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol.dto.js';
import { Rol } from './rol.entity.js';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Rol[]> {
    return this.rolRepository.find();
  }

  async create(createRolDto: CreateRolDto): Promise<Rol> {
    const existing = await this.rolRepository.findOneBy({
      nombre: createRolDto.nombre,
    });
    if (existing) {
      throw new ConflictException(
        `El rol ${createRolDto.nombre} ya está registrado`,
      );
    }
    const rol = this.rolRepository.create(createRolDto);
    return this.rolRepository.save(rol);
  }
}
