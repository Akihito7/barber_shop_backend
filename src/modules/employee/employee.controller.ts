import { Controller, Get, Param, Req } from '@nestjs/common';
import { EmployeeService } from './employee.service';

@Controller("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async getEmployee() {
    return this.employeeService.getEmployees();
  }

  @Get('/me/:id')
  async getUser(@Param('id') id: any) {
    console.log("id", id)
    return this.employeeService.getUser(id);
  }

  //remover pro modulo uses quando criado
}
