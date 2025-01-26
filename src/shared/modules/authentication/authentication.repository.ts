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
    role,
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
          role,
          phoneNumber,
          cpf: cpf ?? null,
        })
        .execute();
    } catch (error) {
      console.error('Error creating user in AuthenticationRepository: ', error);
      throw new Error('Failed to create user.');
    }
  }
}
