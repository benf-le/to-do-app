// In authorization.guard.ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType, User } from '@prisma/client'; // Import User model

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {} // Không cần PrismaService ở đây nữa

  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Nếu không yêu cầu vai trò, cho phép
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Lấy user đã được JwtStrategy xác thực

    // Nếu không có user (bị MyJwtGuard chặn) hoặc user không có vai trò
    if (!user || !user.userType) {
      return false;
    }

    // Kiểm tra xem vai trò của user có nằm trong danh sách vai trò được yêu cầu không
    return requiredRoles.includes(user.userType);
  }
}