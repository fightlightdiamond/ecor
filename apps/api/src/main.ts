import { Logger, UnprocessableEntityException, ValidationPipe, ValidationError } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { webcrypto } from 'node:crypto';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

// Polyfill global `crypto` cho Node < 19 (vd WSL dùng Node 18). @nestjs/schedule
// gọi crypto.randomUUID() toàn cục. Guard để không ghi đè trên Node 20+.
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = webcrypto;
}

/** Gom lỗi validation thành shape giống Laravel: { field: string[] } (HTTP 422). */
function laravelStyleErrors(errors: ValidationError[]): UnprocessableEntityException {
  const formatted: Record<string, string[]> = {};
  const walk = (errs: ValidationError[], prefix = '') => {
    for (const err of errs) {
      const key = prefix ? `${prefix}.${err.property}` : err.property;
      if (err.constraints) {
        formatted[key] = Object.values(err.constraints);
      }
      if (err.children?.length) {
        walk(err.children, key);
      }
    }
  };
  walk(errors);
  return new UnprocessableEntityException({ message: 'Validation failed', errors: formatted });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: laravelStyleErrors,
    }),
  );

  // CORS: dev phản chiếu MỌI origin (khỏi vướng khi đổi cổng FE/Admin);
  // production giới hạn theo CORS_ORIGIN (danh sách ngăn cách bởi dấu phẩy).
  const isProd = process.env.NODE_ENV === 'production';
  const corsOrigins = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: isProd ? (corsOrigins.length ? corsOrigins : false) : true,
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Thang Long Che Viet API')
    .setDescription('NestJS backend — migration từ Laravel be/')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`🚀 API running on http://localhost:${port}/api`);
  logger.log(`📚 Swagger docs on http://localhost:${port}/api/docs`);
  logger.log(`🛠️  Admin API on http://localhost:${port}/api/admin`);
}

bootstrap();
