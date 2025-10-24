import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class TaskDTO {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(Status)
  status: Status;

  @IsDate()
  dueDate: Date;

  @IsInt()
  @IsOptional()
  estimatedTime: number;

  @IsInt()
  @IsOptional()
  actualTime: number;

  @IsDate()
  @IsOptional()
  completedAt: Date;
}
