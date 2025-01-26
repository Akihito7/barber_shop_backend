export interface GetHoursFreeByEmployees {
  employeeUsername: any;
  employeeId: any;
  startDateWithHour: string;
  endDateWithHour: string;
  serviceId: string;
}
//Corrigir a tipagem depois.

export interface GetAppointmentsByDayRepository {
  startDateWithHour: any;
  endDateWithHour: any;
}
//Corrigir a tipagem depois.

export interface GetAppointmentsByEmployeeRepository {
  employeeId: any;
  startDateWithHour: any;
  endDateWithHour: any;
}
//Corrigir a tipagem depois.

export interface GetHoursOpen {
  startHourInMinutes: number;
  endHourInMinutes: number;
  intervalInMinutes: number;
}
