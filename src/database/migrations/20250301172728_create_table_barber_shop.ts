import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('barbershop')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('address', 'text')
    .addColumn('phone', 'varchar(20)')
    .addColumn('opening_hours', 'time', (col) => col.notNull())
    .addColumn('closing_hours', 'time', (col) => col.notNull())
    .addColumn('working_days', 'varchar(100)')
    .addColumn('description', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('barbershop').execute();
}