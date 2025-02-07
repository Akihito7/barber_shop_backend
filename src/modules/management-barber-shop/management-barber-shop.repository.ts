import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';

@Injectable()
export class ManagementBarberShopRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async getBarberShopDetails() {
    return this.db.selectFrom('barbershop').selectAll().executeTakeFirst();
  }
}
