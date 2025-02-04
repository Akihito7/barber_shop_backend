import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ICreateEmployee } from './dtos/request/create-employee-dto';
import { Roles } from 'src/decorators/roles-decorator';
import { RolesGuard } from 'src/guards/roles.guard';

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

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async createEmployee(@Body() body: ICreateEmployee) {
    return this.employeeService.createEmployee(body);
  }

  //remover pro modulo uses quando criado
}
