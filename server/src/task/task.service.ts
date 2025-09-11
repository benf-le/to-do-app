import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  async getAllTasks() {
    try {
      return await this.prismaService.task.findMany();
    } catch (error) {
      console.log(error);
    }
  }
}
