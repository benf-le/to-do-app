import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean, IsOptional,
} from 'class-validator';
import { UserType } from '@prisma/client';

export class UserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsEnum(UserType)
  userType: UserType;
}
