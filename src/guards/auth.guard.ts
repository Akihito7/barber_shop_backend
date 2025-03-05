import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationService } from 'src/shared/modules/authentication/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async canActivate(context: ExecutionContext) {
    const request = this.getRequest(context);
    const authorization = request.headers.authorization;
    const token = this.extractToken(authorization);
    const userId = await this.validateToken(token);
    console.log("its me user id", userId)
    this.attachUserToRequest(request, userId);
    return true;
  }
  private getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }

  private extractToken(authorizationHeader?: string): string {
    if (!authorizationHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }
    const [type, token] = authorizationHeader.split(' ');
    if (type != 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Invalid authorization format. Expected "Bearer <token>".',
      );
    }
    return token;
  }

  private async validateToken(token: string): Promise<number> {
    try {
      const payload = await this.authenticationService.verifyToken(token);
      return Number(payload.sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  private attachUserToRequest(request: any, userId: number): void {
    request.user = {
      id: userId,
    };
  }
}
