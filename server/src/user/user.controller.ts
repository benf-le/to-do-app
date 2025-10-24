import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';

@Controller('users') // Endpoint gốc là /users
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
) // Áp dụng validation cho toàn bộ controller
// @UseGuards(MyJwtGuard, RolesGuard) // Ví dụ: Áp dụng Guard cho toàn bộ controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get() // GET /users
  // @Roles(UserType.ADMIN) // Ví dụ: Chỉ Admin được xem danh sách
  findAll() {
    return this.userService.findAllUsers();
  }

  @Get(':id') // GET /users/:id
  // @Roles(UserType.ADMIN, UserType.USER) // Ví dụ: Admin hoặc chính User đó được xem
  findOne(@Param('id') id: string) {
    // Dùng ParseUUIDPipe nếu ID là UUID
    // Nếu ID là số nguyên, dùng: @Param('id', ParseIntPipe) id: number
    return this.userService.findUserById(id);
  }

  @Patch(':id') // PATCH /users/:id
  // @Roles(UserType.ADMIN) // Ví dụ: Chỉ Admin được sửa
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id') // DELETE /users/:id
  // @Roles(UserType.ADMIN) // Ví dụ: Chỉ Admin được xóa
  @HttpCode(HttpStatus.OK) // Trả về 200 OK khi thành công (thay vì 204 No Content để trả về user đã xóa)
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
