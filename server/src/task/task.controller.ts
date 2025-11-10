import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDTO } from './dto/task.dto';
import { UserInfo, Users } from '../auth/decorator';
import { MyJwtGuard } from '../auth/guard';

@Controller('tasks')
@UseGuards(MyJwtGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  async getTask() {
    return await this.taskService.getAllTasks();
  }
  @Get('/me')
  async getMyTasks(@Users() user: UserInfo) {
    console.log('User ID từ token:', user.id);
    return await this.taskService.getTasksByUserId(user.id);
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string) {
    return await this.taskService.getTasksById(id);
  }

  @Post('/create')
  createTask(@Body() taskDTO: TaskDTO, @Users() user: UserInfo) {
    console.log('Controller đã nhận request. User ID:', user?.id);
    return this.taskService.createTask(taskDTO, user.id);
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
