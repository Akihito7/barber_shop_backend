import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (configSerive: ConfigService) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            connectionString: configSerive.get<string>('DATABASE_URL'),
          }),
        });

        const db = new Kysely({
          dialect,
          plugins: [new CamelCasePlugin()],
        });

        const logger = new Logger('DatabaseModule');

        logger.log('Successfully connected to database');

        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
