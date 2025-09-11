import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // dung cho tat ca moi noi
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
