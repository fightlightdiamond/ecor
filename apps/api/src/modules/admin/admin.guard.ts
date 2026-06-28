import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Chỉ cho phép JWT có type='admin' (cấp khi đăng nhập admin). */
@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }
    if (user.type !== 'admin') {
      throw new ForbiddenException('Chỉ dành cho quản trị viên');
    }
    return user as TUser;
  }

  // giữ chữ ký chuẩn
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
