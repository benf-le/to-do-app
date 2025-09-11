import { IsDate, IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class TaskDTO {
  @IsString()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Status)
  status: Status;

  @IsDate()
  dueDate: Date;

  @IsInt()
  @IsNotEmpty()
  estimatedTime: number;

  @IsInt()
  @IsNotEmpty()
  actualTime: number;

  @IsDate()
  @IsNotEmpty()
  completedAt: Date;
}
