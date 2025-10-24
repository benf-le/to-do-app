import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Đảm bảo đường dẫn đúng
import * as bcrypt from 'bcryptjs';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Lấy tất cả người dùng
   * @returns Danh sách người dùng (không bao gồm mật khẩu)
   */
  async findAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await this.prisma.user.findMany({
        // Chọn các trường muốn trả về, loại bỏ password
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userType: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.error(`Failed to fetch users: ${error.message}`, error.stack);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách người dùng.',
      );
    }
  }

  /**
   * Tìm người dùng theo ID
   * @param id ID của người dùng
   * @returns Người dùng tìm thấy (không bao gồm mật khẩu) hoặc ném lỗi NotFoundException
   */
  async findUserById(id: string): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          userType: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        this.logger.warn(`User with ID ${id} not found.`);
        throw new NotFoundException(
          `Không tìm thấy người dùng với ID "${id}".`,
        );
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to find user by ID ${id}: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      throw new InternalServerErrorException('Không thể tìm người dùng.');
    }
  }

  /**
   * Cập nhật thông tin người dùng
   * @param id ID của người dùng cần cập nhật
   * @param updateUserDto Dữ liệu cần cập nhật
   * @returns Người dùng đã cập nhật (không bao gồm mật khẩu)
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDTO,
  ): Promise<Omit<User, 'password'>> {
    const { password, email, ...updateData } = updateUserDto;
    let hashedPassword: string | undefined = undefined;

    // Chỉ hash password nếu nó được cung cấp trong DTO
    if (password) {
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Nếu email được cung cấp, kiểm tra xem nó có bị trùng với user khác không
    if (email) {
      const existingUserWithEmail = await this.prisma.user.findFirst({
        where: {
          email: email,
          id: { not: id }, // Loại trừ user hiện tại
        },
      });
      if (existingUserWithEmail) {
        throw new ConflictException(
          `Email "${email}" đã được sử dụng bởi người dùng khác.`,
        );
      }
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateData,
          ...(email && { email }), // Chỉ thêm email nếu có
          ...(hashedPassword && { password: hashedPassword }), // Chỉ thêm password nếu đã hash
        },
      });
      this.logger.log(`User updated successfully: ${updatedUser.email}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = updatedUser;
      return result;
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to update user ${id}: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record to update not found
          throw new NotFoundException(
            `Không tìm thấy người dùng với ID "${id}" để cập nhật.`,
          );
        }
        if (error.code === 'P2002') {
          // Unique constraint failed (email)
          throw new ConflictException(`Email "${email}" đã được sử dụng.`);
        }
      }
      throw new InternalServerErrorException('Không thể cập nhật người dùng.');
    }
  }

  /**
   * Xóa người dùng
   * @param id ID của người dùng cần xóa
   * @returns Người dùng đã bị xóa (không bao gồm mật khẩu)
   */
  async deleteUser(id: string): Promise<Omit<User, 'password'>> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });
      this.logger.log(`User deleted successfully: ${deletedUser.email}`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = deletedUser;
      return result;
    } catch (error) {
      this.logger.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to delete user ${id}: ${error.message}`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack,
      );
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Không tìm thấy người dùng với ID "${id}" để xóa.`,
        );
      }
      throw new InternalServerErrorException('Không thể xóa người dùng.');
    }
  }
}
