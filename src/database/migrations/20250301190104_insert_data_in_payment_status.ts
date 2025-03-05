import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto('payments_status')
    .values([
      { id: 1, name: 'Pendente', description: null, color: '#FFA500' },
      { id: 2, name: 'Aprovado', description: null, color: '#32CD32' },
      { id: 3, name: 'Falhado', description: null, color: '#FF0000' },
      { id: 4, name: 'Reembolsado', description: null, color: '#D3D3D3' },
      { id: 5, name: 'Cancelado', description: null, color: '#FF6347' }
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('payments_status')
    .where('id', 'in', [1, 2, 3, 4, 5])
    .execute();
}