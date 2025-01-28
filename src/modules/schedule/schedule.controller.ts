import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateAppoitmentDto } from './dtos/request/create-appointment-dto';
import { FinishAppointment } from './dtos/request/finishe-appointment-dto';
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

  @Get()
  async getAppointmentsByEmployee(@Query() query) {
    return this.scheduleService.getScheduleWithDetailsByEmployee({
      date: query.date,
      employeeId: query.employeeId,
    });
  }

  @Post()
  async createAppointment(@Body() body: CreateAppoitmentDto) {
    return this.scheduleService.createAppointment(body);
  }

  @Post('/finish')
  @HttpCode(201)
  async finishAppointment(@Body() body: FinishAppointment): Promise<void> {
    return this.scheduleService.finishAppointment(body);
  }
}
