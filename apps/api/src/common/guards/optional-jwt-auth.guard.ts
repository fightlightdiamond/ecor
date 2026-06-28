import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Tương đương middleware `sanctum.optional` của Laravel (dùng cho /checkout):
 * nếu có token hợp lệ thì gắn req.user, không có cũng cho qua.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(_err: any, user: TUser): TUser {
    // Không ném lỗi khi thiếu/không hợp lệ token — chỉ trả user (có thể null).
    return user || (null as TUser);
  }
}
