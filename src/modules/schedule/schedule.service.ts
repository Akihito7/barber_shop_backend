import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ScheduleRepository } from './schedule.repository';
import { GetAppointmentsByDayRequestDto } from './dtos/request/get-appointments-by-day-request-dto';
import { GetScheduleWithAvalabilityResponseDto } from './dtos/response/get-schedule-with-availability-response-dto';
import { GetHoursFreeByEmployees, GetHoursOpen } from './types/schedule-types';
import { OfferingsRepository } from '../offerings/offerings.repository';
import { EmployeeRepository } from '../employee/employee.repository';
import { CreateAppoitmentDto } from './dtos/request/create-appointment-dto';
import { FinishAppointment } from './dtos/request/finishe-appointment-dto';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PaymentService } from '../payment/payment.service';
import { ICreateAppointmentWithStripe } from './dtos/request/create-appointment-with-stripe-dto';

@Injectable()
export class ScheduleService {
  private stripe: Stripe;
  constructor(
    private readonly scheduleRepository: ScheduleRepository,
    private readonly offeringsRepository: OfferingsRepository,
    private readonly employeeRepository: EmployeeRepository,
    private readonly paymentService: PaymentService,
    readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_KEY'), {
      apiVersion: '2025-01-27.acacia',
    });
  }

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
    appointments.forEach(
      ({ startTime, endTime }: { startTime: any; endTime: any }) => {
        const startInMinutes =
          startTime.getUTCHours() * 60 + startTime.getUTCMinutes();
        const endInMinutes =
          endTime.getUTCHours() * 60 + endTime.getUTCMinutes();
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
      },
    );
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

  async createAppointment(data: CreateAppoitmentDto) {
    const date = new Date(data.date);
    const formattedDate = date.toISOString().split('T')[0];
    const startDateWithHour = formattedDate + ' 00:00:00';
    const endDateWithHour = formattedDate + ' 23:59:59';
    const employee = await this.employeeRepository.getUser(data.barberId);
    const freeHours = await this.getHoursFreeByEmployees({
      employeeId: data.barberId,
      employeeUsername: employee.username,
      endDateWithHour,
      startDateWithHour,
      serviceId: data.serviceId,
    });
    if (!freeHours.freeHours.includes(data.hour)) {
      throw new ConflictException('Horario ja agendado.');
    }
    const service = await this.offeringsRepository.getServiceDetails(
      data.serviceId,
    );
    const durationInMinutes = service.duration;
    let initialHour = `${formattedDate} ${data.hour}:00`;
    const startDate = new Date(initialHour + ' UTC-3');
    startDate.setMinutes(startDate.getMinutes() + durationInMinutes);
    const endHour = startDate
      .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .replace(',', '')
      .replace(' ', 'T');

    await this.scheduleRepository.createAppointment({
      barberId: data.barberId,
      userId: data.userId,
      date,
      hour: data.hour,
      serviceId: data.serviceId,
      status: data.status,
      startTime: initialHour,
      endTime: endHour,
    });
  }

  async createAppointmentWithStripe(data: ICreateAppointmentWithStripe) {
    const date = new Date(data.date);
    const formattedDate = date.toISOString().split('T')[0];
    const startDateWithHour = formattedDate + ' 00:00:00';
    const endDateWithHour = formattedDate + ' 23:59:59';
    const employee = await this.employeeRepository.getUser(data.barberId);
    const freeHours = await this.getHoursFreeByEmployees({
      employeeId: data.barberId,
      employeeUsername: employee.username,
      endDateWithHour,
      startDateWithHour,
      serviceId: data.serviceId,
    });
    if (!freeHours.freeHours.includes(data.hour)) {
      throw new ConflictException('Horario ja agendado.');
    }
    const service = await this.offeringsRepository.getServiceDetails(
      data.serviceId,
    );
    const durationInMinutes = service.duration;
    let initialHour = `${formattedDate} ${data.hour}:00`;
    const startDate = new Date(initialHour + ' UTC-3');
    startDate.setMinutes(startDate.getMinutes() + durationInMinutes);
    const endHour = startDate
      .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .replace(',', '')
      .replace(' ', 'T');

    try {
      const result: any = await this.paymentService.paymentWithStripe(data);
      if (result && result.ok) {
        const [result] = await this.scheduleRepository.createAppointment({
          barberId: data.barberId,
          userId: data.userId,
          date,
          hour: data.hour,
          serviceId: data.serviceId,
          status: data.status,
          startTime: initialHour,
          endTime: endHour,
        });
        const service = await this.offeringsRepository.getServiceDetails(
          data.serviceId,
        );
        await this.paymentService.createPayment({
          appointmentId: result.id,
          amount: service.price,
          paymentDate: new Date(),
          paymentMethod: data.methodPayment,
          paymentStatus: 'Pago',
        });
      }
    } catch (error) {
      throw new BadRequestException(
        'O pagamento não foi autorizado. Verifique os dados do cartão.',
      );
    }
  }

  async getScheduleWithDetailsByEmployee({
    date,
    employeeId,
  }: {
    date: any;
    employeeId: any;
  }) {
    const startDateWithHour = `${date} 00:00:00`;
    const endDateWithHour = `${date} 23:59:59`;
    return this.scheduleRepository.getScheduleWithDetailsByEmployee({
      employeeId,
      endDateWithHour,
      startDateWithHour,
    });
  }

  async finishAppointment(data: FinishAppointment): Promise<void> {
    const { status } = await this.scheduleRepository.getAppointmentById(
      data.appointmentId,
    );

    if (status === 'finish')
      throw new ConflictException('Serviço já está marcado como finalizado.');

    const { price } = await this.offeringsRepository.getServiceDetails(
      data.serviceId,
    );
    await this.scheduleRepository.finishAppointment(data);
    const registerPayment = {
      appointmentId: data.appointmentId,
      paymentDate: new Date(),
      amount: price,
      methodPayment: data.methodPayment,
      paymentStatus: 'Pago',
    };
    await this.scheduleRepository.registerPayment(registerPayment);
  }
}

//Depois vou dividir isso duas funcoes, uma pra so finalizar o servico e outra pra verificar se ja foi pago antes de finalizar!
