import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskDTO } from './sto/task.dto';

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

  async getTasksById(id: string) {
    try {
      return await this.prismaService.task.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createTask(taskDTO: TaskDTO) {
    try {
      return await this.prismaService.task.create({
        data: {
          title: taskDTO.title,
          description: taskDTO.description,
          status: taskDTO.status,
          dueDate: taskDTO.dueDate ? new Date(taskDTO.dueDate) : null,
          estimatedTime: taskDTO.estimatedTime,
          actualTime: taskDTO.actualTime,
          completedAt: taskDTO.completedAt,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateTask(id: string, taskDTO: TaskDTO) {
    try {
      return await this.prismaService.task.update({
        data: {
          title: taskDTO.title,
          description: taskDTO.description,
          status: taskDTO.status,
          dueDate: taskDTO.dueDate ? new Date(taskDTO.dueDate) : null,
          estimatedTime: taskDTO.estimatedTime,
          actualTime: taskDTO.actualTime,
          completedAt: taskDTO.completedAt,
        },
        where: { id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTask(id: string) {
    try {
      return await this.prismaService.task.delete({
        where: { id },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
