import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('employee')
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async getEmployee() {
    return this.employeeService.getEmployees();
  }

  @Get('/me')
  async getUser(@Req() req: any) {
    return this.employeeService.getUser(req.user.id);
  }

  //remover pro modulo uses quando criado
}
