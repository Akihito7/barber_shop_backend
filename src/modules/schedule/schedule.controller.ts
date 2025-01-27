import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { GetScheduleWithAvalabilityResponseDto } from './dtos/response/get-schedule-with-availability-response-dto';
import { CreateAppoitmentDto } from './dtos/request/create-appointment-dto';

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

  @Post()
  async createAppointment(@Body() body: CreateAppoitmentDto) {
    return this.scheduleService.createAppointment(body);
  }
}
