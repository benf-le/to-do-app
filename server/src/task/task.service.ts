import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable
export class TaskService {
  constructor(private prismaService: PrismaService) {}


}
