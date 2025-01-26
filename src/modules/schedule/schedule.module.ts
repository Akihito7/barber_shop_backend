import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from './schedule.repository';
import { ScheduleController } from './schedule.controller';
import { OfferingsRepository } from '../offerings/offerings.repository';

@Module({
  imports: [],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository, OfferingsRepository],
})
export class ScheduleModule {}
