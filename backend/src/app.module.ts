// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { PrismaService } from './prisma/prisma.service'; // <--- Import here

@Module({
  imports: [JobsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService], // <--- Add PrismaService here
})
export class AppModule {}