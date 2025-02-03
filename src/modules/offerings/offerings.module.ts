import { Module } from '@nestjs/common';
import { OfferingsController } from './offerings.controller';
import { OfferingsService } from './offerings.service';
import { OfferingsRepository } from './offerings.repository';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeRepository } from '../employee/employee.repository';

@Module({
  imports: [],
  controllers: [OfferingsController],
  providers: [
    OfferingsService,
    OfferingsRepository,
    EmployeeService,
    EmployeeRepository,
  ],
})
export class OfferingsModule {}
