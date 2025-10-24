import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException, Logger, InternalServerErrorException } from '@nestjs/common'; // Thêm Logger và InternalServerErrorException
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // 1. Khởi tạo Logger
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    configService: ConfigService,
    public prismaService: PrismaService,
  ) {
    // Lấy secret key TRƯỚC
    const secret = configService.get('JWT_SECRET');

    // GỌI SUPER() NGAY LẬP TỨC
    // Đây là yêu cầu bắt buộc của TypeScript để 'this' hoạt động
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });

    // 2. Log giá trị của secret key (SAU KHI ĐÃ GỌI SUPER)
    if (!secret) {
      this.logger.error('[DEBUG] JWT_SECRET IS MISSING OR UNDEFINED!');
    } else {
      // Chỉ log một phần để xác nhận nó tồn tại, không log toàn bộ key
      this.logger.log(`[DEBUG] JwtStrategy initialized. Secret key loaded (length: ${secret.length}).`);
    }
  }

  async validate(payload: { id: string; email: string }) {
    this.logger.log(`[DEBUG] Validating payload for user id: ${payload?.id}`);

    if (!payload || !payload.id) {
      this.logger.warn(`[DEBUG] JWT payload is invalid or missing 'id'.`);
      throw new UnauthorizedException('Invalid token payload.');
    }

    // 3. Thêm try...catch để bắt lỗi Prisma
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        this.logger.warn(`[DEBUG] User not found in DB for id: ${payload.id}`);
        throw new UnauthorizedException('User not found');
      }

      this.logger.log(`[DEBUG] User validated successfully: ${user.email}`);
      // Đối tượng bạn return ở đây sẽ được Passport gán vào `request.user`
      return user;

    } catch (error) {
      // 4. Log bất kỳ lỗi nào xảy ra (ví dụ: lỗi kết nối DB)
      this.logger.error(`[DEBUG] Error during user validation in JwtStrategy: ${error.message}`, error.stack);
      // Ném ra lỗi 500 để biết lỗi xảy ra ở đây
      throw new InternalServerErrorException('Error validating user.');
    }
  }
}

