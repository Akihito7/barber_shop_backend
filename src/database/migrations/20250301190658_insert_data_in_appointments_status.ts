import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto('appointments_status')
    .values([
      { id: 1, name: 'Agendado', description: null, color: '#ADD8E6' },
      { id: 2, name: 'Em andamento', description: null, color: '#FFD700' },
      { id: 3, name: 'Finalizado', description: null, color: '#32CD32' },
      { id: 4, name: 'Cancelado', description: null, color: '#FF6347' }
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('appointments_status')
    .where('id', 'in', [1, 2, 3, 4])
    .execute();
}
