import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy';
import { MyJwtGuard } from './guard';
import { AuthorizationGuard } from './guard/authorization.guard';

@Module({
  imports: [
    PrismaModule, // 1. Thêm vào đây
    ConfigModule, // 2. Thêm vào đây
    PassportModule.register({ defaultStrategy: 'jwt' }), // 3. Thêm vào đây
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy, // 4. Thêm vào đây
    MyJwtGuard, // 5. Thêm vào đây
    AuthorizationGuard, // 6. Thêm vào đây
  ],
  exports: [
    MyJwtGuard, // 7. Export Guard
    AuthorizationGuard, // 8. Export Guard
  ],
})
export class AuthModule {}
