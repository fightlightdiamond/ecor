import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from '../decorators/current-user.decorator';

/** RBAC tương đương Spatie permission — dùng sau khi JwtAuthGuard đã chạy. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user as AuthUser | undefined;
    const userRoles = user?.roles ?? [];
    if (!required.some((role) => userRoles.includes(role))) {
      throw new ForbiddenException('Insufficient permissions');
    }
    return true;
  }
}
