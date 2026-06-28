import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AdminGuard } from './admin.guard';
import { AdminAuthService } from './admin-auth.service';

class AdminLoginDto {
  @IsString() @IsNotEmpty() email!: string;
  @IsString() @IsNotEmpty() password!: string;
}

@ApiTags('Admin / Auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly auth: AdminAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AdminLoginDto) {
    const result = await this.auth.login(dto.email, dto.password);
    return { success: true, ...result };
  }

  @UseGuards(AdminGuard)
  @Get('me')
  async me(@CurrentUser('sub') sub: number) {
    return { success: true, data: await this.auth.me(Number(sub)) };
  }
}
