import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './categoria.entity.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepository.find();
  }

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return this.categoriaRepository.save(categoria);
  }

  async update(id: number, dto: UpdateCategoriaDto): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOneBy({ categoriaId: id });
    if (!categoria) throw new NotFoundException(`No existe la categoría con el id ${id}`);
    categoria.nombre = dto.nombre;
    return this.categoriaRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriaRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`No existe la categoría con el id ${id}`);
  }
}
