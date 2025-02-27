import { BadRequestException, Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepository: DashboardRepository) {}
  async getDailyRevenue(dateString: string) {
    if (!this.dateIsCorrectFormmat(dateString)) {
      throw new BadRequestException(
        'Formato de data invalido. formato esperado mm/dd/yyyyy',
      );
    }
    const previousDate = new Date(dateString);
    previousDate.setDate(previousDate.getDate() - 1);
    const formattedInitialDate = dateString + ' 00:00:00';
    const formmatedEndDate = dateString + ' 23:59:59';

    const previousFormattedInitialDate =
      previousDate.toISOString().split('T')[0] + ' 00:00:00';
    const previousFormattedEndDate =
      previousDate.toISOString().split('T')[0] + ' 23:59:59';
    const currentDay = await this.dashboardRepository.getDailyRevenue({
      formattedInitialDate,
      formmatedEndDate,
    });

    const previousDay = await this.dashboardRepository.getDailyRevenue({
      formattedInitialDate: previousFormattedInitialDate,
      formmatedEndDate: previousFormattedEndDate,
    });

    let percentageChange: string | number = 0;
    if (Number(previousDay.dailyRevenue) > 0) {
      percentageChange = Number(
        (
          ((Number(currentDay.dailyRevenue) -
            Number(previousDay.dailyRevenue)) *
            100) /
          Number(previousDay.dailyRevenue)
        ).toFixed(2),
      );
    } else if (
      Number(previousDay.dailyRevenue) === 0 &&
      Number(currentDay.dailyRevenue) > 0
    ) {
      percentageChange = Number(currentDay.dailyRevenue).toFixed(2);
    } else if (
      Number(previousDay.dailyRevenue) === 0 &&
      Number(currentDay.dailyRevenue) === 0
    ) {
      percentageChange = 0;
    }
    const formattedPercentageChange =
      Number(percentageChange) === 0 || String(percentageChange).includes('-')
        ? percentageChange
        : `+${percentageChange}`;

    return {
      dailyRevenue: currentDay.dailyRevenue,
      percentageChange: formattedPercentageChange,
    };
  }

  async getWeeklyRevenue(dateString: string) {
    if (!this.dateIsCorrectFormmat(dateString)) {
      throw new BadRequestException(
        'Formato de data invalido. formato esperado mm/dd/yyyyy',
      );
    }
    const previousWeek = new Date(dateString);
    previousWeek.setDate(previousWeek.getDate() - 7);
    const currentMonday = this.getMonday(dateString)
      .toISOString()
      .split('T')[0];
    const currentNextSunday = this.getNextSunday(dateString)
      .toISOString()
      .split('T')[0];
    const formattedInitialDate = currentMonday + ' 00:00:00';
    const formmatedEndDate = currentNextSunday + ' 23:59:59';
    const currentWeeklyRevenue =
      await this.dashboardRepository.getWeeklyRevenue({
        formattedInitialDate,
        formmatedEndDate,
      });
    const previousMonday = this.getMonday(previousWeek.toISOString())
      .toISOString()
      .split('T')[0];
    const previousNextSunday = this.getNextSunday(previousWeek.toISOString())
      .toISOString()
      .split('T')[0];
    const previousFormattedInitialDate = previousMonday + ' 00:00:00';
    const previousFormattedEndDate = previousNextSunday + ' 23:59:59';
    const previousWeeklyRevenue =
      await this.dashboardRepository.getWeeklyRevenue({
        formattedInitialDate: previousFormattedInitialDate,
        formmatedEndDate: previousFormattedEndDate,
      });

    let percentageChange: string | number = 0;
    if (Number(previousWeeklyRevenue.weeklyRevenue) > 0) {
      percentageChange = Number(
        (
          ((Number(currentWeeklyRevenue.weeklyRevenue) -
            Number(previousWeeklyRevenue.weeklyRevenue)) *
            100) /
          Number(previousWeeklyRevenue.weeklyRevenue)
        ).toFixed(2),
      );
    } else if (
      Number(previousWeeklyRevenue.weeklyRevenue) === 0 &&
      Number(currentWeeklyRevenue.weeklyRevenue) > 0
    ) {
      percentageChange = Number(currentWeeklyRevenue.weeklyRevenue).toFixed(2);
    } else if (
      Number(previousWeeklyRevenue.weeklyRevenue) === 0 &&
      Number(currentWeeklyRevenue.weeklyRevenue) === 0
    ) {
      percentageChange = 0;
    }
    const formattedPercentageChange =
      Number(percentageChange) === 0 || String(percentageChange).includes('-')
        ? percentageChange
        : `+${percentageChange}`;

    return {
      weeklyRevenue: currentWeeklyRevenue.weeklyRevenue,
      percentageChange: formattedPercentageChange,
    };
  }

  async getMonthlyRevenue(dateString: string) {
    if (!this.dateIsCorrectFormmat(dateString)) {
      throw new BadRequestException(
        'Formato de data invalido. formato esperado mm/dd/yyyyy',
      );
    }
    const formattedInitialDate =
      this.getFirstDayOfMonth(dateString).toISOString().split('T')[0] +
      ' 00:00:00';
    const formmatedEndDate =
      this.getLastDayOfMonth(dateString).toISOString().split('T')[0] +
      ' 23:59:59';

    const [year, month, day] = dateString.split('-');
    const newMonth = String(
      Number(month) - 1 === 0 ? '12' : Number(month) - 1,
    ).padStart(2, '0');
    const oneMonthBefore = `${year}-${newMonth}-${day}`;

    const formattedInitialDatePreviousMonth =
      this.getFirstDayOfMonth(oneMonthBefore).toISOString().split('T')[0] +
      ' 00:00:00';

    const formattedEndDatePreviousMonth =
      this.getLastDayOfMonth(oneMonthBefore).toISOString().split('T')[0] +
      ' 23:59:59';

    const currentMonth = await this.dashboardRepository.getMonthlyRevenue({
      formattedInitialDate,
      formmatedEndDate,
    });

    const previousMonth = await this.dashboardRepository.getMonthlyRevenue({
      formattedInitialDate: formattedInitialDatePreviousMonth,
      formmatedEndDate: formattedEndDatePreviousMonth,
    });

    let percentageChange: string | number = 0;
    if (Number(previousMonth.monthlyRevenue) > 0) {
      percentageChange = Number(
        (
          ((Number(currentMonth.monthlyRevenue) -
            Number(previousMonth.monthlyRevenue)) *
            100) /
          Number(previousMonth.monthlyRevenue)
        ).toFixed(2),
      );
    } else if (
      Number(previousMonth.monthlyRevenue) === 0 &&
      Number(currentMonth.monthlyRevenue) > 0
    ) {
      percentageChange = Number(currentMonth.monthlyRevenue).toFixed(2);
    } else if (
      Number(previousMonth.monthlyRevenue) === 0 &&
      Number(currentMonth.monthlyRevenue) === 0
    ) {
      percentageChange = 0;
    }
    const formattedPercentageChange =
      Number(percentageChange) === 0 || String(percentageChange).includes('-')
        ? percentageChange
        : `+${percentageChange}`;
    return {
      monthlyRevenue: currentMonth.monthlyRevenue,
      percentageChange: String(formattedPercentageChange),
    };
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
    if (!this.dateIsCorrectFormmat(dateString)) {
      throw new BadRequestException(
        'Formato de data invalido. formato esperado mm/dd/yyyyy',
      );
    }
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
    if (!this.dateIsCorrectFormmat(dateString)) {
      throw new BadRequestException(
        'Formato de data invalido. formato esperado mm/dd/yyyyy',
      );
    }
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

  dateIsCorrectFormmat(dateString: string): Boolean {
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    return dateRegex.test(dateString);
  }
}
