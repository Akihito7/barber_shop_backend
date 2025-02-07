import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';

@Injectable()
export class PaymentRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

  async createPayment(data: any) {
    await this.db
      .insertInto('payments')
      .values({
        appointmentId: data.appointmentId,
        amount: data.amount,
        paymentDate: data.paymentDate,
        paymentStatusId: data.paymentStatusId,
        paymentMethodsId: data.paymentMethodsId,
      })
      .execute();
  }

  async getPaymentByAppointmentId(appointmentId : any) {
    return this.db
      .selectFrom('payments')
      .where('appointmentId', '=', appointmentId)
      .selectAll()
      .executeTakeFirst();
  }
}
