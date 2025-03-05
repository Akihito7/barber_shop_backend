import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('appointments')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer')
    .addColumn('barber_id', 'integer')
    .addColumn('start_time', 'timestamptz', (col) => col.notNull())
    .addColumn('end_time', 'timestamptz', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('service_id', 'integer')
    .addColumn('payment_method', 'varchar(255)', (col) =>
      col.defaultTo('MONEY'),
    )
    .addColumn('status_id', 'integer')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('appointments').execute();
}