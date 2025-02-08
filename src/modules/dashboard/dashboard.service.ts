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
    const firstDay = new Date(date.getFullYear(), date.getUTCMonth(), 1);
    return firstDay;
  }

  private getLastDayOfMonth(dateString: string) {
    const date = new Date(dateString);
    const nextMonth = new Date(date.getFullYear(), date.getUTCMonth() + 1, 1);
    nextMonth.setDate(nextMonth.getDate() - 1);
    return nextMonth;
  }

  async getTopSellingServices(dateString: string) {
    let formattedInitialDate;
    let formmatedEndDate;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const currentMonth = date.getMonth();

    if (currentMonth < 6) {
      const firstMonth = new Date(year, 0, 1);
      const sixthMonth = new Date(year, 5, 1);
      formattedInitialDate = `${firstMonth.toISOString().split('T')[0]} 00:00:00`;
      formmatedEndDate = `${sixthMonth.toISOString().split('T')[0]} 23:59:59`;
    } else {
      const sixthMonth = new Date(year, 6, 1);
      const twelfthMonth = new Date(year, 11, 1);
      formattedInitialDate = `${sixthMonth.toISOString().split('T')[0]} 00:00:00`;
      formmatedEndDate = `${twelfthMonth.toISOString().split('T')[0]} 23:59:59`;
    }

    return this.dashboardRepository.getTopSellingServices({
      formattedInitialDate,
      formmatedEndDate,
    });
  }

  async getRevenueBySemester(dateString: string) {
    let formattedInitialDate;
    let formmatedEndDate;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const currentMonth = date.getMonth();

    if (currentMonth < 6) {
      const firstMonth = new Date(year, 0, 1);
      const sixthMonth = new Date(year, 5, 1);
      formattedInitialDate = `${firstMonth.toISOString().split('T')[0]} 00:00:00`;
      formmatedEndDate = `${sixthMonth.toISOString().split('T')[0]} 23:59:59`;
    } else {
      const sixthMonth = new Date(year, 6, 1);
      const twelfthMonth = new Date(year, 11, 1);
      formattedInitialDate = `${sixthMonth.toISOString().split('T')[0]} 00:00:00`;
      formmatedEndDate = `${twelfthMonth.toISOString().split('T')[0]} 23:59:59`;
    }
    const result = await this.dashboardRepository.getRevenueBySemester({
      formattedInitialDate,
      formmatedEndDate,
    });

    const startMonth = currentMonth < 6 ? 'January' : 'July';
    const endMonth = currentMonth < 6 ? 'June' : 'December';
    return {
      startMonth,
      endMonth,
      result,
    };
  }
}
