import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { UserType } from '@prisma/client';

@Controller({})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register/:userType')
  async register(
    @Body() registerDTO: RegisterDTO,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.USER) {
      return 'This feature is in development';
    }
    return await this.authService.register(registerDTO, userType);
  }

  @Post('/login')
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
  }
}
