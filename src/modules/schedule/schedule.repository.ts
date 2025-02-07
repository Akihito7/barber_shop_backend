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
      .returning(['id'])
      .execute();
  }

  async getScheduleWithDetailsByEmployee({
    employeeId,
    startDateWithHour,
    endDateWithHour,
  }: GetAppointmentsByEmployeeRepository) {
    return this.db
      .selectFrom('appointments as a')
      .innerJoin('users as u', 'u.id', 'a.userId')
      .innerJoin('services as s', 's.id', 'a.serviceId')
      .select([
        'a.id',
        'a.userId',
        'a.barberId',
        'a.startTime',
        'a.endTime',
        'a.createdAt',
        'a.updatedAt',
        's.id as serviceId',
        'a.paymentMethod',
        's.description',
        'u.photo',
        'u.phoneNumber',
        'u.username',
        'u.lastLogin',
        's.price',
        's.duration',
        's.name',
        'u.email',
        'a.status',
      ])
      .where('a.barberId', '=', employeeId)
      .where('a.startTime', '>=', startDateWithHour)
      .where('a.endTime', '<=', endDateWithHour)
      .execute();
  }
  async finishAppointment(data: any) {
    return this.db
      .updateTable('appointments')
      .set({
        paymentMethod: data.methodPayment,
        status: 'finish',
      })
      .where('appointments.id', '=', data.appointmentId)
      .execute();
  }

  async registerPayment(data: any) {
    return this.db
      .insertInto('payments')
      .values({
        appointmentId: data.appointmentId,
        paymentMethod: data.methodPayment,
        paymentDate: data.paymentDate,
        amount: data.amount,
        paymentStatus: data.paymentStatus,
      })
      .execute();
  }

  async getAppointmentById(appointmentId: any) {
    return this.db
      .selectFrom('appointments')
      .selectAll()
      .where('id', '=', appointmentId)
      .executeTakeFirst();
  }

  async getAppointmentByClient(userId: any) {
    return this.db
      .selectFrom('appointments')
      .innerJoin('services', 'services.id', 'appointments.serviceId')
      .where('userId', '=', userId)
      .where('status', '=', 'schedule')
      .selectAll()
      .execute();
  }
}
