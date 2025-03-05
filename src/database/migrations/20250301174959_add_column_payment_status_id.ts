import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Adiciona a coluna payment_status_id
  await db.schema
    .alterTable('payments')
    .addColumn('payment_status_id', 'integer', (col) => col.references('payments_status.id')) // Define a chave estrangeira
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // 1. Remove a coluna payment_status_id
  await db.schema
    .alterTable('payments')
    .dropColumn('payment_status_id')
    .execute();
}