import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';

@Injectable()
export class OfferingsRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async getServices() {
    return this.db.selectFrom('services').selectAll().execute();
  }

  async getServiceDetails(serviceId: any) {
    return this.db
      .selectFrom('services')
      .selectAll()
      .where('id', '=', serviceId)
      .executeTakeFirst();
  }

  async createService(data: any): Promise<void> {
    await this.db.insertInto('services').values(data).execute();
  }

  async updateService({ serviceId, data }) {
    await this.db
      .updateTable('services')
      .set({
        name: data.name,
        price: data.price,
        description: data.description,
        duration: data.duration,
      })
      .where('id', '=', serviceId)
      .executeTakeFirst();
  }

  async deleteService({ serviceId }: { serviceId: any }): Promise<void> {
    await this.db
      .deleteFrom('services')
      .where('id', '=', serviceId)
      .executeTakeFirst();
  }
}
