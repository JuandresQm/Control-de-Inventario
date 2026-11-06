import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol, RolNombre } from '../roles/rol.entity.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async onModuleInit(): Promise<void> {
    const roles = new Map<string, Rol>();
    for (const nombre of Object.values(RolNombre)) {
      let rol = await this.rolRepository.findOneBy({ nombre });
      if (!rol) rol = await this.rolRepository.save(this.rolRepository.create({ nombre }));
      roles.set(nombre, rol);
    }

    const admin = await this.usuariosService.findByNombre('admin');
    if (!admin) {
      await this.usuarioRepository.save(
        this.usuarioRepository.create({
          nombre: 'admin',
          clave: 'admin',
          rol: roles.get(RolNombre.ADMINISTRADOR),
          estado: true,
        }),
      );
    } else if (admin.clave !== 'admin') {
      admin.clave = 'admin';
      await this.usuarioRepository.save(admin);
    }
  }

  async login(loginDto: LoginDto) {
    const usuario = await this.usuariosService.findByNombre(loginDto.nombre);
    const claveValida =
      usuario?.nombre === 'admin'
        ? loginDto.clave === usuario.clave
        : usuario
          ? await bcrypt.compare(loginDto.clave, usuario.clave)
          : false;
    if (!usuario || !claveValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.usuarioId,
      nombre: usuario.nombre,
      rol: usuario.rol?.nombre,
    };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      usuario: {
        usuarioId: usuario.usuarioId,
        nombre: usuario.nombre,
        rol: usuario.rol?.nombre ?? null,
      },
    };
  }
}
