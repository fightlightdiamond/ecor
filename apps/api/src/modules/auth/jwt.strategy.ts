import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'dev-secret-key-change-in-production',
    });
  }

  /**
   * Phase 0: trả thẳng payload. Phase 7 (Customer) / Phase 9 (Users) sẽ
   * nạp thêm thông tin từ DB và kiểm tra trạng thái tài khoản tại đây.
   */
  validate(payload: AuthUser): AuthUser {
    return {
      sub: payload.sub,
      type: payload.type ?? 'customer',
      roles: payload.roles ?? [],
    };
  }
}
