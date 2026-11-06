import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { Categoria } from './categoria.entity.js';
import { CategoriasService } from './categorias.service.js';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  findAll(): Promise<Categoria[]> {
    return this.categoriasService.findAll();
  }

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoriaDto): Promise<Categoria> {
    return this.categoriasService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoriasService.remove(Number(id));
  }
}
