import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async getEmployees() {
    return this.employeeRepository.getEmployees();
  }

  async getUser(id: any) {
    return this.employeeRepository.getUser(id);
  }
}
