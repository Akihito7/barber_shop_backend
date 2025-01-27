import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleController } from './schedule.controller';
import { OfferingsRepository } from '../offerings/offerings.repository';
import { EmployeeRepository } from '../employee/employee.repository';

@Module({
  imports: [],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    ScheduleRepository,
    OfferingsRepository,
    EmployeeRepository,
  ],
})
export class ScheduleModule {}
