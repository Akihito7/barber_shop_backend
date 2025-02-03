import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles-decorator';
import { EmployeeService } from 'src/modules/employee/employee.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly employeeService: EmployeeService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const user = await this.employeeService.getUser(userId);
    const hasRole = () =>
      user.roles.some((role) => requiredRoles.includes(role.toUpperCase()));
    if (!hasRole()) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta rota',
      );
    }
    return true;
  }
}
