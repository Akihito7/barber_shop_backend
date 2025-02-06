import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleController } from './schedule.controller';
import { OfferingsRepository } from '../offerings/offerings.repository';
import { EmployeeRepository } from '../employee/employee.repository';
import { PaymentService } from '../payment/payment.service';
import { PaymentRepository } from '../payment/payment.repository';

@Module({
  imports: [],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    OfferingsRepository,
    EmployeeRepository,
    PaymentService,
    PaymentRepository,
  ],
})
export class ScheduleModule {}
