import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import Database from 'src/database/schema/Database';
import {
  GetAppointmentsByDayRepository,
  GetAppointmentsByEmployeeRepository,
} from './types/schedule-types';

@Injectable()
export class ScheduleRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async getAppointmentsByDay({
    startDateWithHour,
    endDateWithHour,
  }: GetAppointmentsByDayRepository) {
    return this.db
      .selectFrom('appointments')
      .selectAll()
      .where('startTime', '>=', startDateWithHour)
      .where('endTime', '<=', endDateWithHour)
      .execute();
  }

  async getAppointmentsByEmployee({
    employeeId,
    startDateWithHour,
    endDateWithHour,
  }: GetAppointmentsByEmployeeRepository) {
    const result = await this.db
      .selectFrom('appointments')
      .select([
        sql`start_time - INTERVAL '3 hours'`.as('startTime'),
        sql`end_time - INTERVAL '3 hours'`.as('endTime'),
        'serviceId',
        'barberId',
      ])
      .where('barberId', '=', employeeId)
      .where('startTime', '>=', startDateWithHour)
      .where('endTime', '<=', endDateWithHour)
      .execute();
    return result;
  }

  async createAppointment({
    userId,
    barberId,
    serviceId,
    status,
    startTime,
    endTime,
  }: any) {
    return this.db
      .insertInto('appointments')
      .values({
        userId,
        barberId,
        serviceId,
        status,
        startTime,
        endTime,
      })
      .execute();
  }
}
