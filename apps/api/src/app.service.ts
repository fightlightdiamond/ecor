import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInfo() {
    return {
      name: 'Thang Long Che Viet API',
      status: 'running',
      docs: '/api/docs',
    };
  }
}
