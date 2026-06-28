import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { AppointmentService } from '../booking/appointment.service';
import { presentOrder } from '../order/order.presenter';
import { LoginDto, RegisterDto } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly appointments: AppointmentService,
  ) {}

  async register(dto: RegisterDto) {
    const phone = AppointmentService.normalizePhone(dto.phone);
    const existing = await this.prisma.customer.findFirst({ where: { phone } });
    if (existing) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: { phone: ['Số điện thoại đã được sử dụng.'] },
      });
    }

    const now = new Date();
    const customer = await this.prisma.customer.create({
      data: {
        name: dto.name,
        phone,
        email: dto.email ?? null,
        password: await bcrypt.hash(dto.password, 12),
        createdAt: now,
        updatedAt: now,
      },
    });

    await this.appointments.linkToCustomer(customer.id, phone);
    return { success: true, data: { token: this.issueToken(customer), customer: this.format(customer) } };
  }

  async login(dto: LoginDto) {
    const phone = AppointmentService.normalizePhone(dto.phone);
    const customer = await this.prisma.customer.findFirst({ where: { phone } });
    if (!customer || !(await bcrypt.compare(dto.password, customer.password))) {
      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: { phone: ['Thông tin đăng nhập không chính xác.'] },
      });
    }
    await this.appointments.linkToCustomer(customer.id, phone);
    return { success: true, data: { token: this.issueToken(customer), customer: this.format(customer) } };
  }

  logout() {
    // JWT stateless: client xoá token. (Có thể thêm denylist nếu cần thu hồi.)
    return { success: true, message: 'Đã đăng xuất' };
  }

  async profile(customerId: number) {
    const customer = await this.prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng');
    return { success: true, data: this.format(customer) };
  }

  async listOrders(customerId: number) {
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: orders.map((o) => presentOrder(o)) };
  }

  async listAppointments(customerId: number) {
    const items = await this.prisma.appointment.findMany({
      where: { customerId },
      orderBy: { scheduledAt: 'desc' },
    });
    return { success: true, data: items.map((a) => this.appointments.formatForApi(a)) };
  }

  async cancelAppointment(customerId: number, id: number) {
    const appointment = await this.prisma.appointment.findFirst({ where: { id, customerId } });
    if (!appointment) throw new NotFoundException('Không tìm thấy lịch hẹn');
    const result = await this.appointments.cancelByCustomer(appointment, customerId);
    if (!result.success) throw new BadRequestException(result.message);
    return { success: true, message: result.message };
  }

  private issueToken(customer: Customer): string {
    return this.jwt.sign({ sub: customer.id, type: 'customer' });
  }

  private format(customer: Customer) {
    return { id: customer.id, name: customer.name, phone: customer.phone, email: customer.email };
  }
}
