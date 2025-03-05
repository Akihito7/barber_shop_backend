import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Adiciona uma nova coluna temporária do tipo text[]
  await db.schema
    .alterTable('users')
    .addColumn('roles_temp', 'jsonb', (col) => col.defaultTo('[]'))
    .execute();

  // 2. Converte os dados da coluna antiga para a nova coluna
  await sql`
    UPDATE users
    SET roles_temp = ARRAY[roles]::text[]
    WHERE roles IS NOT NULL
  `.execute(db);

  // 3. Remove a coluna antiga
  await db.schema
    .alterTable('users')
    .dropColumn('roles')
    .execute();

  // 4. Renomeia a nova coluna para o nome original
  await db.schema
    .alterTable('users')
    .renameColumn('roles_temp', 'roles')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // 1. Adiciona uma nova coluna temporária do tipo varchar
  await db.schema
    .alterTable('users')
    .addColumn('roles_temp', 'varchar')
    .execute();

  // 2. Converte os dados da coluna text[] para a nova coluna varchar
  await sql`
    UPDATE users
    SET roles_temp = roles[1]
    WHERE array_length(roles, 1) = 1
  `.execute(db);

  // 3. Remove a coluna text[]
  await db.schema
    .alterTable('users')
    .dropColumn('roles')
    .execute();

  // 4. Renomeia a nova coluna para o nome original
  await db.schema
    .alterTable('users')
    .renameColumn('roles_temp', 'roles')
    .execute();
}