import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateAppoitmentDto } from './dtos/request/create-appointment-dto';
import { FinishAppointment } from './dtos/request/finishe-appointment-dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetScheduleWithAvalabilityResponseDto } from './dtos/response/get-schedule-with-availability-response-dto';
import { ICreateAppointmentWithStripe } from './dtos/request/create-appointment-with-stripe-dto';
import { IGetAppointmentByClientId } from './dtos/response/get-appointment-by-client-id-response-dto';

@Controller('schedule')
@UseGuards(AuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}
  @Get('client')
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

  @Post('appointment/create')
  async createAppointment(@Body() body: CreateAppoitmentDto) {
    return this.scheduleService.createAppointment(body);
  }

  @Post('appointment/create-with-stripe')
  async createAppointmentWithStripe(
    @Body() body: ICreateAppointmentWithStripe,
  ) {
    return this.scheduleService.createAppointmentWithStripe(body);
  }

  @Post('/finish')
  @HttpCode(201)
  async finishAppointment(@Body() body: FinishAppointment): Promise<void> {
    return this.scheduleService.finishAppointment(body);
  }

  @Get('appointment/client')
  async getAppointmentByClient(
    @Req() req,
  ): Promise<IGetAppointmentByClientId[]> {
    return this.scheduleService.getAppointmentByClient(req.user.id);
  }

}
