import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectDTO } from './dto/project.dto';
import { UserInfo, Users } from '../auth/decorator';
import { ProjectService } from './project.service';

@Controller('/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  async getProject() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.projectService.getProjects();
  }

  @Get(`:id`) // register a new user
  async getProductsById(@Param('id') id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.projectService.getProjectById(id);
  }

  @Patch('/update/:id')
  updateProject(@Body() projectDTO: ProjectDTO, @Param('id') id: string) {
    return this.projectService.updateProject(projectDTO, id);
  }

  @Post('/create')
  createProject(@Body() projectDTO: ProjectDTO, @Users() user: UserInfo) {
    return this.projectService.createProject(projectDTO, user.id);
  }

  @Delete('/delete/:id')
  deleteProduct(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
