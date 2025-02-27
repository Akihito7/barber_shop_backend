import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import Database from 'src/database/schema/Database';
import { convertNumberToUserId } from 'src/utils/convert-number-to-user-id';
import { IUpdateEmployee } from './dtos/request/update-employee-dto';

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

  async getUser(userId: number) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', convertNumberToUserId(userId))
      .executeTakeFirst();
  }

  async getUserByEmail(email: string) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async getUserByUsername(username: string) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();
  }

  async getUserByPhoneNumber(phoneNumber: string) {
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

  async upatedEmployee(data: IUpdateEmployee) {
    await this.db
      .updateTable('users')
      .set({
        username: data.username,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber.toString(),
      })
      .where('id', '=', convertNumberToUserId(data.id))
      .execute();
  }

  async deleteEmployee(employeeId: number) {
    await this.db
      .deleteFrom('users')
      .where('id', '=', convertNumberToUserId(employeeId))
      .execute();
  }
  //remover pro modulo users quando criado
}
