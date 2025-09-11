import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';

@Module({
  imports:[PrismaService],
  controllers: [TaskController],
  providers:[TaskService],

})