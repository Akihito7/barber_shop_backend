import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';
import { AppointmentsId } from 'src/database/schema/public/Appointments';
import { ICreatePayment } from './dtos/request/create-payment-dto';
import { PaymentsStatusId } from 'src/database/schema/public/PaymentsStatus';
import { PaymentMethodsId } from 'src/database/schema/public/PaymentMethods';

@Injectable()
export class PaymentRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async createPayment(data: ICreatePayment) {
    await this.db
      .insertInto('payments')
      .values({
        appointmentId: data.appointmentId as AppointmentsId,
        amount: data.amount,
        paymentDate: data.paymentDate,
        paymentStatusId: data.paymentStatusId as PaymentsStatusId,
        paymentMethodsId: data.paymentMethodsId as PaymentMethodsId,
      })
      .execute();
  }

  async getPaymentByAppointmentId(appointmentId: number) {
    return this.db
      .selectFrom('payments')
      .where('appointmentId', '=', appointmentId as AppointmentsId)
      .selectAll()
      .executeTakeFirst();
  }
}
