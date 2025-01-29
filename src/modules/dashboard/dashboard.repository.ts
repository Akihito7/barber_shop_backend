import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';

@Injectable()
export class DashboardRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async getDailyRevenue({ formattedInitialDate, formmatedEndDate }: any) {
    return this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select('s.price')
      .where('a.startTime', '>=', formattedInitialDate)
      .where('a.endTime', '<=', formmatedEndDate)
      .where('a.status', '=', 'finish')
      .execute();
  }

  async getWeeklyRevenue({ formattedInitialDate, formmatedEndDate }: any) {
    return this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select('s.price')
      .where('a.startTime', '>=', formattedInitialDate)
      .where('a.endTime', '<=', formmatedEndDate)
      .where('a.status', '=', 'finish')
      .execute();
  }

  async getMonthlyRevenue({ formattedInitialDate, formmatedEndDate }: any) {
    return this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select('s.price')
      .where('a.startTime', '>=', formattedInitialDate)
      .where('a.endTime', '<=', formmatedEndDate)
      .where('a.status', '=', 'finish')
      .execute();
  }
}
