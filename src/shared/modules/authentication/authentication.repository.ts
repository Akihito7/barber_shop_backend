import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';
import { SignupRequestDto } from './dtos/request/signup-request-dto';

@Injectable()
export class AuthenticationRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async getUserByUsername({ username }: { username: string }) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();
  }

  async getUserByEmail({ email }: { email: string }) {
    return this.db
      .selectFrom('users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst();
  }

  async createUser({
    username,
    email,
    password,
    phoneNumber,
    address,
    cpf,
    photo,
  }: SignupRequestDto) {
    try {
      return this.db
        .insertInto('users')
        .values({
          username,
          email,
          password,
          photo,
          address,
          roles: ['client'],
          phoneNumber,
          cpf: cpf ?? null,
          isAccountActive: false,
        })
        .execute();
    } catch (error) {
      console.error('Error creating user in AuthenticationRepository: ', error);
      throw new Error('Failed to create user.');
    }
  }

  async deleteUser(userId: any) {
    await this.db.deleteFrom('users').where('id', '=', userId).execute();
  }

  async getCodeEmailVerification({ email, code }: any) {
    return this.db
      .selectFrom('emailVerifications')
      .where('email', '=', email)
      .where('code', '=', code)
      .selectAll()
      .executeTakeFirst();
  }

  async deleteCodeEmailVerification(code: any) {
    await this.db
      .deleteFrom('emailVerifications')
      .where('code', '=', code)
      .execute();
  }

  async accountActivation(email: any) {
    await this.db
      .updateTable('users')
      .set({
        isAccountActive: true,
      })
      .where('email', '=', email)
      .execute();
  }

  async saveCodeChangePassword({ email, code }: any) {
    await this.db
      .insertInto('passwordReset')
      .values({
        email,
        code,
      })
      .execute();
  }

  async getCodeChangePassword(code: any) {
    return this.db
      .selectFrom('passwordReset')
      .selectAll()
      .where('code', '=', code)
      .executeTakeFirst();
  }

  async resetPassword({ email, password }: any) {
    await this.db
      .updateTable('users')
      .set({
        password,
      })
      .where('email', '=', email)
      .execute();
  }

  async deleteCodeChangePassword(code: string) {
    await this.db
      .deleteFrom('passwordReset')
      .where('code', '=', code)
      .execute();
  }
}
