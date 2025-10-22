import { ProjectDTO } from './dto/project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProjects() {
    try {
      const project = await this.prismaService.project.findMany({});
      return project;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  async getProjectById(id: string) {
    try {
      const projectById = await this.prismaService.project.findUnique({
        where: {
          id,
        },
      });
      return projectById;
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return error;
    }
  }

  async createProject(projectDTO: ProjectDTO, userId: string) {
    return this.prismaService.project.create({
      data: {
        name: projectDTO.name,
        userId: userId,
      },
    });
  }

  async updateProject(projectDTO: ProjectDTO, id: string) {
    return this.prismaService.project.update({
      data: {
        name: projectDTO.name,
      },
      where: { id },
    });
  }

  async deleteProject(id: string) {
    return this.prismaService.project.delete({
      where: { id },
    });
  }
}
