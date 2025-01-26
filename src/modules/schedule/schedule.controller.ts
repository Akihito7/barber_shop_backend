import { Controller, Get, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { GetScheduleWithAvalabilityResponseDto } from './dtos/response/get-schedule-with-availability-response-dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  @Get()
  async getScheduleWithAvailability(
    @Query() query,
  ): Promise<GetScheduleWithAvalabilityResponseDto[]> {
    return this.scheduleService.getScheduleWithAvailability({
      date: query.date,
      serviceId: query.serviceId,
    });
  }
}
