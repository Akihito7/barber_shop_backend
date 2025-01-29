import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  @Get('daily-revenue')
  async getDailyRevenue(@Query() query) {
    return this.dashboardService.getDailyRevenue(query.date);
  }

  @Get('weekly-revenue')
  async getWeeklyRevenue(@Query() query) {
    return this.dashboardService.getWeeklyRevenue(query.date);
  }

  @Get('monthly-revenue')
  async getMonthlyRevenue(@Query() query) {
    return this.dashboardService.getMonthlyRevenue(query.date);
  }
}
