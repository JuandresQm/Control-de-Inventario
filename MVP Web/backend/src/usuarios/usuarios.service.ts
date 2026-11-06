import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../roles/rol.entity.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { Usuario } from './usuario.entity.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
  ) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ relations: { rol: true } });
  }

  async findByNombre(nombre: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.clave')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .where('usuario.nombre = :nombre', { nombre })
      .andWhere('usuario.estado = :estado', { estado: true })
      .getOne();
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const rol = await this.rolRepository.findOneBy({
      rolId: createUsuarioDto.rolId,
    });

    if (!rol) {
      throw new NotFoundException(
        `No existe un rol con el id ${createUsuarioDto.rolId}`,
      );
    }

    const usuario = this.usuarioRepository.create({
      nombre: createUsuarioDto.nombre,
      clave: await bcrypt.hash(createUsuarioDto.clave, 12),
      estado: createUsuarioDto.estado,
      rol,
    });

    return this.usuarioRepository.save(usuario);
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ usuarioId: id });
    if (!usuario) throw new NotFoundException(`No existe el usuario con el id ${id}`);
    const rol = await this.rolRepository.findOneBy({ rolId: dto.rolId });
    if (!rol) throw new NotFoundException(`No existe un rol con el id ${dto.rolId}`);
    usuario.nombre = dto.nombre;
    usuario.rol = rol;
    usuario.estado = dto.estado ?? usuario.estado;
    if (dto.clave) usuario.clave = await bcrypt.hash(dto.clave, 12);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.delete(id);
    if (!result.affected) throw new NotFoundException(`No existe el usuario con el id ${id}`);
  }
}
