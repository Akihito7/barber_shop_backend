import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import Database from 'src/database/schema/Database';

@Injectable()
export class EmployeeRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}
  async getEmployees() {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where(
        'roles',
        '@>',
        sql`ARRAY['employee']::text[]` as unknown as string[],
      )
      .execute();
  }

  async getUser(id: any) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  }

  async getUserByEmail(email: any) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async getUserByUsername(username: any) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();
  }

  async getUserByPhoneNumber(phoneNumber: any) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('phoneNumber', '=', phoneNumber)
      .execute();
  }

  async createEmployee({
    username,
    email,
    password,
    phoneNumber,
    role,
    roles,
  }: any) {
    await this.db
      .insertInto('users')
      .values({ username, email, password, phoneNumber, role, roles })
      .execute();
  }
  //remover pro modulo users quando criado
}
