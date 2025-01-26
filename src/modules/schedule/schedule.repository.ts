import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
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
    return this.db
      .selectFrom('appointments')
      .select(['startTime', 'endTime', 'serviceId', 'barberId'])
      .where('barberId', '=', employeeId)
      .where('startTime', '>=', startDateWithHour)
      .where('endTime', '<=', endDateWithHour)
      .execute();
  }

  async getEmployees() {
    return this.db
      .selectFrom('users')
      .select(['id', 'username'])
      .where('role', '=', 'employee')
      .execute();
  }
  //Remover daqui ao criar o modulo pra employee
}
