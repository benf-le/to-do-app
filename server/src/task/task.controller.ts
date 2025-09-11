import { Controller, Get, Param } from '@nestjs/common';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  async getTask() {
    return await this.taskService.getAllTasks();
  }

  @Get('/:id')
  async getTaskById(@Param('id')id: string) {
    return await this.taskService.getTasksById(id);
  }
}
