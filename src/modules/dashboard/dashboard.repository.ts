import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import Database from 'src/database/schema/Database';
import { IDates } from './dtos/dates.dto';
import { PaymentsStatusId } from 'src/database/schema/public/PaymentsStatus';
import {
  AppointmentsStatus,
  AppointmentsStatusId,
} from 'src/database/schema/public/AppointmentsStatus';

@Injectable()
export class DashboardRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async getDailyRevenue({ formattedInitialDate, formmatedEndDate }: IDates) {
    const result = await this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select(({ fn }) => [fn.sum('s.price').as('dailyRevenue')])
      .where('a.startTime', '>=', formattedInitialDate)
      .where('a.endTime', '<=', formmatedEndDate)
      .where('a.statusId', '=', 3 as AppointmentsStatusId)
      .executeTakeFirst();

    if (result.dailyRevenue === null) {
      result.dailyRevenue = 0;
      return result;
    }

    return result;
  }

  async getWeeklyRevenue({ formattedInitialDate, formmatedEndDate }: IDates) {
    const result = await this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select(({ fn }) => [fn.sum('s.price').as('weeklyRevenue')])
      .where('a.startTime', '>=', formattedInitialDate)
      .where('a.endTime', '<=', formmatedEndDate)
      .where('a.statusId', '=', 3 as AppointmentsStatusId)
      .executeTakeFirst();

    if (result.weeklyRevenue === null) {
      result.weeklyRevenue = 0;
      return result;
    }

    return result;
  }

  async getMonthlyRevenue({ formattedInitialDate, formmatedEndDate }: IDates) {
    const result = await this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select(({ fn }) => [fn.sum('s.price').as('monthlyRevenue')])
      .where('a.startTime', '>=', formattedInitialDate)
      .where('a.endTime', '<=', formmatedEndDate)
      .where('a.statusId', '=', 3 as AppointmentsStatusId)
      .executeTakeFirst();

    if (result.monthlyRevenue === null) {
      result.monthlyRevenue = 0;
      return result;
    }

    return result;
  }

  async getTopSellingServices({
    formattedInitialDate,
    formmatedEndDate,
  }: IDates) {
    return this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select([
        's.id',
        's.name',
        (eb) => eb.fn.count('s.id').as('total_by_service'),
      ])
      .where('a.startTime', '>=', formattedInitialDate)
      .where('a.endTime', '<=', formmatedEndDate)
      .groupBy(['s.id', 's.name'])
      .execute();
  }

  async getRevenueBySemester({
    formattedInitialDate,
    formmatedEndDate,
  }: IDates) {
    return this.db
      .selectFrom('appointments as a')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select([
        (eb) => eb.fn.sum('s.price').as('total_revenue'),
        (eb) => sql`TO_CHAR(start_time, 'YYYY-MM')`.as('monthCode'),
        (eb) => sql`TO_CHAR(start_time, 'FMMonth')`.as('monthName'),
        (eb) => eb.fn.countAll().as('total_records'),
      ])
      .where('startTime', '>=', formattedInitialDate)
      .where('startTime', '<', formmatedEndDate)
      .groupBy(['monthCode', 'monthName'])
      .orderBy('monthCode')
      .execute();
  }
}
