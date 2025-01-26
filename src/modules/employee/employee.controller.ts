import { Controller, Get } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller()
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async getEmployee() {
    return this.employeeService.getEmployees();
  }
}
