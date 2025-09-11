import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDTO } from './sto/task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  async getTask() {
    return await this.taskService.getAllTasks();
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string) {
    return await this.taskService.getTasksById(id);
  }

  @Post('/create')
  createTask(@Body() taskDTO: TaskDTO) {
    return this.taskService.createTask(taskDTO);
  }

  @Patch('/update/:id')
  updateTask(@Param('id') id: string, @Body() taskDTO: TaskDTO) {
    return this.taskService.updateTask(id, taskDTO);
  }

  @Delete('/delete/:id')
  deleteTask(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }
}
