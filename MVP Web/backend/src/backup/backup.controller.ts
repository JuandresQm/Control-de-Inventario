import {
  Controller,
  Get,
  Header,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { BackupService } from './backup.service.js';

@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrador')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('database')
  @Header('Content-Type', 'application/sql')
  async database(): Promise<StreamableFile> {
    const backup = await this.backupService.createDatabaseBackup();
    return new StreamableFile(backup.content, {
      disposition: `attachment; filename="${backup.filename}"`,
      type: 'application/sql',
    });
  }
}
