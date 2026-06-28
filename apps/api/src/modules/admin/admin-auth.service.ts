import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({ where: { email, isAdmin: true } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    return {
      token: this.jwt.sign({ sub: user.id, type: 'admin', email: user.email }),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async me(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !user.isAdmin) throw new NotFoundException('Không tìm thấy admin');
    return { id: user.id, name: user.name, email: user.email, avatarUrl: user.avatarUrl };
  }
}
