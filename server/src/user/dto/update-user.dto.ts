// Kế thừa từ CreateUserDTO nhưng làm tất cả các trường thành tùy chọn (optional)
import { IsBoolean, IsOptional } from 'class-validator';
import { UserDTO } from './user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDTO extends PartialType(UserDTO) {
  // Thêm lại isActive vì nó có thể được cập nhật, nhưng là tùy chọn
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean.' })
  @IsOptional() // Đánh dấu là tùy chọn
  isActive?: boolean;
}
