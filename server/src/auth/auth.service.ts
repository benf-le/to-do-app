import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  private generateJWT(
    firstName: string,
    lastName: string,
    email: string,
    id: string,
    userType: UserType,
  ) {
    return jwt.sign(
      {
        id,
        email,
        firstName,
        lastName,
        userType,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '30d',
      },
    );
  }

  async register(newUser: SignUpParams, userType: UserType) {
    const userExist = await this.prismaService.user.findUnique({
      where: {
        email: newUser.email,
      },
    });

    if (userExist) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(newUser.password, 12);

    const user = await this.prismaService.user.create({
      data: {
        email: newUser.email,
        password: hashedPassword,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType,
      },
    });

    const accessToken = await this.generateJWT(user.firstName, user.lastName, user.email, user.id, user.userType)
    return "User registered successfully\n Access Token: " + accessToken;
  }


  async login(loginUser: SignInParams) {
    const user = await this.prismaService.user.findUnique({
      where:{
        email: loginUser.email,
      }
    })

    if (!user) {
      throw new HttpException("Invalid email", 400)
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is locked.Please contact with admin.');
    }

    const hashedPassword = user.password

    const isValidPassword = await bcrypt.compare(loginUser.password, hashedPassword);
    if (!isValidPassword) {
      throw new HttpException("Invalid password", 400)
    }

    console.log(user.userType)

    const accessToken = this.generateJWT(user.firstName, user.lastName, user.email, user.id, user.userType)

    return {'Access Token': accessToken, 'UserId': user.id}
  }
}
