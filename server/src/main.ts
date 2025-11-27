import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({});

  // app.setGlobalPrefix('api'); // nếu bạn dùng prefix /api ở Nest, nhớ điều chỉnh proxy ở Nginx tương ứng
  await app.listen(process.env.PORT ?? 8001, '0.0.0.0');
}
bootstrap();
