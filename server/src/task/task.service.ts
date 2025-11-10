import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskDTO } from './dto/task.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaskService {
  // Tạo một logger riêng cho Service này
  private readonly logger = new Logger(TaskService.name);

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

  async getTasksByUserId(userId: string) {
    try {
      return await this.prismaService.task.findMany({
        where: {
          userId: userId,
        },
        orderBy: {
          createdAt: 'desc', // sắp xếp nếu cần
        },
      });
    } catch (error) {
      console.error('[TaskService.getTasksByUserId] Error:', error);
      throw new InternalServerErrorException('Could not fetch tasks by user');
    }
  }

  async createTask(taskDTO: TaskDTO, userId: string) {
    // BƯỚC 1: LOG DỮ LIỆU ĐẦU VÀO
    this.logger.log(`[DEBUG] Attempting to create task for user: ${userId}`);
    this.logger.debug(
      `[DEBUG] DTO received: ${JSON.stringify(taskDTO, null, 2)}`,
    );

    const data = {
      title: taskDTO.title,
      description: taskDTO.description,
      status: taskDTO.status,
      dueDate: taskDTO.dueDate ? new Date(taskDTO.dueDate) : null,
      estimatedTime: taskDTO.estimatedTime,
      actualTime: taskDTO.actualTime,
      completedAt: taskDTO.completedAt,
      userId: userId, // Giữ nguyên cấu trúc này
    };

    this.logger.debug(
      `[DEBUG] Data being sent to Prisma: ${JSON.stringify(data, null, 2)}`,
    );

    // BƯỚC 2: Thêm lại TRY...CATCH để bắt lỗi của PRISMA
    try {
      const task = await this.prismaService.task.create({ data });
      this.logger.log(`Task created successfully with id: ${task.id}`);
      return task;
    } catch (error) {
      // BƯỚC 3: LOG LỖI CHI TIẾT
      this.logger.error(
        `[DEBUG] Failed to create task for user: ${userId}`,
        error.stack,
      );

      // Xử lý lỗi Prisma cụ thể
      if (error instanceof Prisma.PrismaClientValidationError) {
        // Lỗi thiếu trường, sai kiểu dữ liệu
        this.logger.error(
          `[DEBUG] Prisma Validation Error. \nFrontend DTO: ${JSON.stringify(taskDTO)} \nPrisma Message: ${error.message}`,
        );
        // Ném lỗi này ra để NestJS gửi về 400 Bad Request
        throw new InternalServerErrorException(
          `Validation error creating task. Check server logs.`,
        );
      }

      // Ném ra lỗi chung để NestJS xử lý
      this.logger.error(`[DEBUG] Unknown error: ${error.message}`);
      throw new InternalServerErrorException(
        `Could not create task. Check server logs.`,
      );
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
