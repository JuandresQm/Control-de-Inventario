import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module.js';
import {InventarioModule} from './inventario/inventario.module.js';
import { RolesModule } from './roles/roles.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { CategoriasModule } from './categorias/categorias.module.js';
import { UbicacionesModule } from './ubicaciones/ubicaciones.module.js';
import { MovimientosModule } from './movimientos/movimientos.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UnidadesMedidaModule } from './unidades-medida/unidades-medida.module.js';
import { BackupModule } from './backup/backup.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
      extra: { options: '-c timezone=America/Caracas' },
    }),
    ProductosModule,
    InventarioModule,
    RolesModule,
    UsuariosModule,
    CategoriasModule,
    UbicacionesModule,
    MovimientosModule,
    AuthModule,
    UnidadesMedidaModule,
    BackupModule,
  ],
})
export class AppModule {}