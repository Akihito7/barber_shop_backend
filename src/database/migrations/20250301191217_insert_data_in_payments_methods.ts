import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto('payment_methods')
    .values([
      { id: 1, name: 'Dinheiro', description: 'Pagamento em espécie' },
      { id: 2, name: 'Credito', description: 'Pagamento via cartão de crédito' },
      { id: 3, name: 'Debito', description: 'Pagamento via cartão de débito' },
      { id: 4, name: 'Pix', description: 'Pagamento via transferência instantânea utilizando o Pix' }
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('payment_methods')
    .where('id', 'in', [1, 2, 3, 4])
    .execute();
}
