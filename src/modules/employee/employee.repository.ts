import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';

@Injectable()
export class EmployeeRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}
  async getEmployees() {
    return this.db
      .selectFrom('users')
      .select(['id', 'username'])
      .where('role', '=', 'employee')
      .execute();
  }
}
