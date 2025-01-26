import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('appointments')
    .addColumn('id', 'serial', (col) => col.primaryKey()) 
    .addColumn('user_id', 'integer', (col) => col.notNull().references('users.id').onDelete('cascade')) 
    .addColumn('barber_id', 'integer', (col) => col.notNull().references('users.id').onDelete('cascade')) 
    .addColumn('start_time', 'timestamp', (col) => col.notNull()) 
    .addColumn('end_time', 'timestamp', (col) => col.notNull()) 
    .addColumn('status', 'varchar', (col) => col.notNull()) 
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(), 
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(), 
    )
    .addColumn('service_id', 'integer', (col) => col.notNull().references('services.id').onDelete('cascade')) 
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('appointments').execute(); 
}
