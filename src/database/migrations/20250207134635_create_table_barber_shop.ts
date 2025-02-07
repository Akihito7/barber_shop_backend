import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('barbershop')
    .ifNotExists()
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('address', 'text', (col) => col.notNull())
    .addColumn('phone', 'varchar(20)', (col) => col)
    .addColumn('opening_hours', 'time', (col) => col.notNull())
    .addColumn('closing_hours', 'time', (col) => col.notNull())
    .addColumn('working_days', 'varchar(100)', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('barbershop').execute();
}
