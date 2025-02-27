import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { ICreateEmployee } from './dtos/request/create-employee-dto';
import { IUpdateEmployee } from './dtos/request/update-employee-dto';
import * as bcrypt from 'bcrypt';
import { Kysely } from 'kysely';
import Database from 'src/database/schema/Database';
import { Pool } from 'pg'; // Adicionado para escutar eventos

@Injectable()
export class EmployeeService {
  private static isListening = false; // Variável estática para evitar múltiplas conexões

  constructor(
    private readonly employeeRepository: EmployeeRepository,
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<Database>,
  ) {}

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
    if (emailExists) throw new ConflictException('Email já em uso');

    const usernameExists =
      await this.employeeRepository.getUserByUsername(username);
    if (usernameExists) throw new ConflictException('Username já em uso');

    const phoneUsageCount = await this.employeeRepository.getUserByPhoneNumber(
      phoneNumber.toString(),
    );
    if (phoneUsageCount.length >= 3)
      throw new ConflictException('Número usado o máximo de vezes');

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
    const isSamePassword = data.password === user.password;
    if (!isSamePassword) {
      const updatePasswordHash = await bcrypt.hash(data.password, 8);
      data.password = updatePasswordHash;
    }
    await this.employeeRepository.upatedEmployee(data);
  }

  async deleteEmployee(employeeId: number) {
    return this.employeeRepository.deleteEmployee(employeeId);
  }
}
