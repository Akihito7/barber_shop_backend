import { ConflictException, Injectable } from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { ICreateEmployee } from './dtos/request/create-employee-dto';
import { IUpdateEmployee } from './dtos/request/update-employee-dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async getEmployees() {
    return this.employeeRepository.getEmployees();
  }

  async getUser(id: any) {
    return this.employeeRepository.getUser(id);
  }

  async createEmployee({
    username,
    email,
    password,
    phoneNumber,
    role,
    roles,
  }: ICreateEmployee): Promise<void> {
    const emailExists = await this.employeeRepository.getUserByEmail(email);
    if (emailExists) throw new ConflictException('Email ja em uso');

    const usernameExists =
      await this.employeeRepository.getUserByUsername(username);
    if (usernameExists) throw new ConflictException('Username ja em uso');

    const phoneUsageCount =
      await this.employeeRepository.getUserByPhoneNumber(phoneNumber);
    if (phoneUsageCount.length >= 3)
      throw new ConflictException('Numero usado o maximo de vezes');

    await this.employeeRepository.createEmployee({
      username,
      email,
      password,
      phoneNumber,
      role,
      roles,
    });
  }

  async updateEmployee(data: IUpdateEmployee) {
    const user = await this.employeeRepository.getUser(data.id);
    const isSamePassowrd = data.password === user.password;
    if (!isSamePassowrd) {
      const updatePasswordHash = await bcrypt.hash(data.password, 8);
      data.password = updatePasswordHash;
    }
    await this.employeeRepository.upatedEmployee(data);
  }

  async deleteEmployee(employeeId: number) {
    return this.employeeRepository.deleteEmployee(employeeId);
  }
}
