import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('payments') 
    .addColumn('id', 'serial', (col) => col.primaryKey()) 
    .addColumn('appointment_id', 'integer', (col) => col.notNull().references('appointments.id').onDelete('cascade')) 
    .addColumn('amount', 'decimal', (col) => col.notNull()) 
    .addColumn('payment_method', 'varchar', (col) => col.notNull()) 
    .addColumn('payment_status', 'varchar', (col) => col.notNull()) 
    .addColumn('payment_date', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull()) 
    .addColumn('receipt_url', 'text', (col) => col) 
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(), 
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(), 
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('payments').execute(); 
}
