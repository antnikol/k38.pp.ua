import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';  // Імпортуємо наш вже існуючий JWT Guard
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard extends JwtAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;  // Передбачається, що інформація про користувача зберігається в токені

    if (!user || !roles.some(role => user.roles?.includes(role))) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    return true;
  }
}
