import { Injectable } from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { GetAppointmentsByDayRequestDto } from './dtos/request/get-appointments-by-day-request-dto';
import { GetScheduleWithAvalabilityResponseDto } from './dtos/response/get-schedule-with-availability-response-dto';
import { GetHoursFreeByEmployees, GetHoursOpen } from './types/schedule-types';
import { OfferingsRepository } from '../offerings/offerings.repository';
import { EmployeeRepository } from '../employee/employee.repository';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly offeringsRepository: OfferingsRepository,
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  private startHourInMinutes = 11 * 60;
  private endHourInMinutes = 21.5 * 60;
  private intervalInMinutes = 30;

  async getScheduleWithAvailability({
    date,
    serviceId,
  }: GetAppointmentsByDayRequestDto): Promise<
    GetScheduleWithAvalabilityResponseDto[]
  > {
    const hours = this.getHoursOpen({
      startHourInMinutes: this.startHourInMinutes,
      endHourInMinutes: this.endHourInMinutes,
      intervalInMinutes: this.intervalInMinutes,
    });
    const employees = await this.employeeRepository.getEmployees();
    const startDateWithHour = date + ' 00:00:00';
    const endDateWithHour = date + ' 23:59:59';
    const freeHoursByEmployee = await Promise.all(
      employees.map(async (e) => {
        return this.getHoursFreeByEmployees({
          employeeUsername: e.username,
          employeeId: e.id,
          startDateWithHour,
          endDateWithHour,
          serviceId,
        });
      }),
    );
    const generalAvailability = hours.map((hour) => ({
      date,
      hour,
      freeEmployees: [],
      status: 'free',
    }));
    generalAvailability.forEach((slot) => {
      freeHoursByEmployee.forEach(
        ({ employeeUsername, employeeId, freeHours }) => {
          if (freeHours.includes(slot.hour)) {
            slot.freeEmployees.push({
              employeeUsername,
              employeeId,
            });
          }
        },
      );
      if (slot.freeEmployees.length === 0) {
        slot.status = 'busy';
      }
    });
    return generalAvailability;
  }

  private async getHoursFreeByEmployees({
    employeeUsername,
    employeeId,
    startDateWithHour,
    endDateWithHour,
    serviceId,
  }: GetHoursFreeByEmployees) {
    const appointments =
      await this.scheduleRepository.getAppointmentsByEmployee({
        employeeId,
        startDateWithHour,
        endDateWithHour,
      });

    const allHours = this.getHoursOpen({
      startHourInMinutes: this.startHourInMinutes,
      endHourInMinutes: this.endHourInMinutes,
      intervalInMinutes: this.intervalInMinutes,
    });
    const occupiedSlots = new Set<string>();
    appointments.forEach(({ startTime, endTime }) => {
      const startInMinutes =
        startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
      const endInMinutes = endTime.getUTCHours() * 60 + endTime.getUTCMinutes();
      if (
        endInMinutes <= this.startHourInMinutes ||
        startInMinutes >= this.endHourInMinutes
      )
        return;
      const startSlot = Math.max(this.startHourInMinutes, startInMinutes);
      const endSlot = Math.min(this.endHourInMinutes, endInMinutes);
      for (
        let time = startSlot;
        time < endSlot;
        time += this.intervalInMinutes
      ) {
        const hours = Math.floor(time / 60);
        const mins = time % 60;
        occupiedSlots.add(
          `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
        );
      }
    });
    const freeHours = allHours.filter((hour) => !occupiedSlots.has(hour));
    const service = await this.offeringsRepository.getServiceDetails(serviceId);
    const requiredSlots = service.duration / 30;
    const consecutiveFreeHours: string[] = [];
    for (let i = 0; i <= freeHours.length - requiredSlots; i++) {
      const window = freeHours.slice(i, i + requiredSlots);
      const isConsecutive = window.every((time, index) => {
        if (index === 0) return true;
        const prevTimeInMinutes =
          parseInt(window[index - 1].split(':')[0]) * 60 +
          parseInt(window[index - 1].split(':')[1]);
        const currTimeInMinutes =
          parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
        return currTimeInMinutes - prevTimeInMinutes === this.intervalInMinutes;
      });
      if (isConsecutive) {
        consecutiveFreeHours.push(freeHours[i]);
      }
    }
    return {
      employeeUsername,
      employeeId,
      freeHours: consecutiveFreeHours,
    };
  }

  private getHoursOpen({
    startHourInMinutes,
    endHourInMinutes,
    intervalInMinutes,
  }: GetHoursOpen) {
    const totalSlots =
      (endHourInMinutes - startHourInMinutes) / intervalInMinutes;
    const allHours = Array.from({ length: totalSlots }, (_, index) => {
      const minutes = startHourInMinutes + index * intervalInMinutes;
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    });
    return allHours;
  }
}
