import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}
  async getDailyRevenue(date: string) {
    const formattedInitialDate = date + ' 00:00:00';
    const formmatedEndDate = date + ' 23:59:59';
    return this.dashboardRepository.getDailyRevenue({
      formattedInitialDate,
      formmatedEndDate,
    });
  }

  async getWeeklyRevenue(dateString: string) {
    const monday = this.getMonday(dateString).toISOString().split('T')[0];
    const nextSunday = this.getNextSunday(dateString)
      .toISOString()
      .split('T')[0];
    const formattedInitialDate = monday + ' 00:00:00';
    const formmatedEndDate = nextSunday + ' 23:59:59';
    return this.dashboardRepository.getWeeklyRevenue({
      formattedInitialDate,
      formmatedEndDate,
    });
  }

  async getMonthlyRevenue(dateString: string) {
    const formattedInitialDate =
      this.getFirstDayOfMonth(dateString).toISOString().split('T')[0] +
      ' 00:00:00';
    const formmatedEndDate =
      this.getLastDayOfMonth(dateString).toISOString().split('T')[0] +
      ' 23:59:59';
    return this.dashboardRepository.getMonthlyRevenue({
      formattedInitialDate,
      formmatedEndDate,
    });
  }

  private getMonday(dateString: string) {
    const date = new Date(dateString);
    const day = date.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    date.setUTCDate(date.getUTCDate() + diff);
    return date;
  }

  private getNextSunday(dateString: string) {
    const date = new Date(dateString);
    const day = date.getUTCDay();
    const diffToSunday = day === 0 ? 0 : 7 - day;
    date.setUTCDate(date.getUTCDate() + diffToSunday);
    return date;
  }

  private getFirstDayOfMonth(dateString: string) {
    const date = new Date(dateString);
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return firstDay;
  }

  private getLastDayOfMonth(dateString: string) {
    const date = new Date(dateString);
    const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    nextMonth.setDate(nextMonth.getDate() - 1);
    return nextMonth;
  }
}
