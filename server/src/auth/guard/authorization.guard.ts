import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import * as process from 'process';
import { PrismaService } from '../../prisma/prisma.service';

interface JWTPayload {
  email: string;
  id: string;
  createdAt: number;
  updatedAt: number;
}

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    console.log('The required roles are', requiredRoles);

    if (requiredRoles?.length) {
      //Grab the JWT from the request header and verify it
      const request = context.switchToHttp().getRequest();
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        // Lấy secret key ra
        const secret = process.env.JSON_TOKEN_KEY;

        // Kiểm tra xem nó có tồn tại không
        if (!secret) {
          console.error(
            'Lỗi nghiêm trọng: JSON_TOKEN_KEY chưa được thiết lập!',
          );
          return false; // Hoặc ném ra một lỗi 500
        }
        // 1. Bỏ 'await' vì jwt.verify là hàm đồng bộ
        const payload = jwt.verify(
          token,
          secret,
        ) as unknown as JWTPayload; // 2. Ép kiểu qua 'unknown' rồi mới tới 'JWTPayload'

        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id, // Bây giờ code sẽ chạy
          },
        });

        if (!user) return false;

        if (requiredRoles.includes(user.userType)) return true;
        return false;
      } catch (e) {
        // Lưu ý: Lỗi (e) ở đây có thể là 'TokenExpiredError' hoặc 'JsonWebTokenError'
        // Bạn nên console.log(e) để xử lý tốt hơn
        console.error('Lỗi xác thực token:', e.message);
        return false;
      }
    }
    //
    // const userRoles = request.user.role
    //
    // if(requiredRoles !== userRoles) return false
    //
    //
    // console.log('INSIDE AUTHORIZATION GUARD')
    return true;
  }
}
