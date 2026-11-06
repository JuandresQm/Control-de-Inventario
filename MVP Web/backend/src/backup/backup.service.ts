import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { env } from 'node:process';

interface BackupResult {
  content: Buffer;
  filename: string;
}

@Injectable()
export class BackupService {
  async createDatabaseBackup(): Promise<BackupResult> {
    const database = process.env.DB_NAME;
    const host = process.env.DB_HOST;
    const port = process.env.DB_PORT ?? '5433';
    const username = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;

    if (!database || !host || !username) {
      throw new InternalServerErrorException(
        'La configuración de la base de datos está incompleta',
      );
    }

    const chunks: Buffer[] = [];
    const errors: Buffer[] = [];
    const exitCode = await new Promise<number>((resolve, reject) => {
      const child = spawn(
        'pg_dump',
        [
          '--host',
          host,
          '--port',
          port,
          '--username',
          username,
          '--format=plain',
          '--no-owner',
          '--no-privileges',
          database,
        ],
        {
          env: {
            ...env,
            PGPASSWORD: password ?? '',
          },
          windowsHide: true,
        },
      );

      child.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
      child.stderr.on('data', (chunk: Buffer) => errors.push(chunk));
      child.on('error', reject);
      child.on('close', (code) => resolve(code ?? 1));
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException(
        `No se pudo ejecutar pg_dump. Verifica que PostgreSQL esté instalado y pg_dump esté en PATH: ${message}`,
      );
    });

    if (exitCode !== 0) {
      const detail = Buffer.concat(errors).toString('utf8').trim();
      throw new InternalServerErrorException(
        `No se pudo generar el respaldo${detail ? `: ${detail}` : ''}`,
      );
    }

    const timestamp = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Caracas',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
      .format(new Date())
      .replace(/[-: ]/g, '');

    return {
      content: Buffer.concat(chunks),
      filename: `respaldo-inventario-${timestamp}.sql`,
    };
  }
}
