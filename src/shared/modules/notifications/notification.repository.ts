import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';

@Injectable()
export class NotificationRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async createEmailCodeValidation({ email, code }: any) {
    await this.db
      .insertInto('emailVerifications')
      .values({
        email,
        code,
      })
      .execute();
  }
}
