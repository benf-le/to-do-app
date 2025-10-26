import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://todoapp.lecambang.id.vn',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // app.setGlobalPrefix('api'); // nếu bạn dùng prefix /api ở Nest, nhớ điều chỉnh proxy ở Nginx tương ứng
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
