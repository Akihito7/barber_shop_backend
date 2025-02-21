import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ICreateEmployee } from './dtos/request/create-employee-dto';
import { Roles } from 'src/decorators/roles-decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { IUpdateEmployee } from './dtos/request/update-employee-dto';

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

  @Put('update')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async updateEmployee(@Body() body: IUpdateEmployee) {
    return this.employeeService.updateEmployee(body);
  }

  @Delete('delete/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async deleteEmployee(@Param('id') employeeId) {
    return this.employeeService.deleteEmployee(employeeId);
  }

  //remover pro modulo uses quando criado
}
