import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('payments')
    .addColumn('id', 'serial', (col) => col.primaryKey()) 
    .addColumn('appointment_id', 'integer') 
    .addColumn('amount', 'numeric', (col) => col.notNull()) 
    .addColumn('payment_date', 'timestamp', (col) => col.notNull()) 
    .addColumn('receipt_url', 'text') 
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(), 
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull(), 
    )
    .addColumn('payment_status', 'integer') 
    .addColumn('payment_method', 'integer') 
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('payments').execute(); 
}