import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DashboardService } from './dashboard.service';
import { IDate } from './dtos/request/date.dto';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('daily-revenue')
  async getDailyRevenue(@Query() query: IDate) {
    return this.dashboardService.getDailyRevenue(query.date);
  }

  @Get('weekly-revenue')
  async getWeeklyRevenue(@Query() query: IDate) {
    return this.dashboardService.getWeeklyRevenue(query.date);
  }

  @Get('monthly-revenue')
  async getMonthlyRevenue(@Query() query: IDate) {
    return this.dashboardService.getMonthlyRevenue(query.date);
  }

  @Get('top-sellings')
  async getTopSellingServices(@Query() query: IDate) {
    return this.dashboardService.getTopSellingServices(query.date);
  }

  @Get('by-semester')
  async getRevenueBySemester(@Query() query: IDate) {
    return this.dashboardService.getRevenueBySemester(query.date);
  }
}
