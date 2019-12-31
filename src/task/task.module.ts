import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';

@Module({
  controllers: [TaskController],
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  providers: [TaskService],
})
export class TaskModule {}
