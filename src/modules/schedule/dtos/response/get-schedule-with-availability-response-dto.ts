export interface GetScheduleWithAvalabilityResponseDto {
  hour: string;
  freeEmployees: {
    employeeUsername: string;
    employeeId: number;
  }[];
  status: string;
}
