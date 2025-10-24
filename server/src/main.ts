import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors({
      origin: ['http://localhost:5173'],
      credentials: true,
    });
  }
  // app.setGlobalPrefix('api'); // nếu bạn dùng prefix /api ở Nest, nhớ điều chỉnh proxy ở Nginx tương ứng
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
