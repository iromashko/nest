import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  Query,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { FilterTaskDto } from './dto/filter-task.dto';
import { ValidateTaskStatus } from './pipes/validate-task-status.pipe';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}
  @Post()
  createTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }
  @Get()
  getTasks(
    @Query(ValidationPipe) filterTaskDto: FilterTaskDto,
  ): Promise<Task[]> {
    return this.taskService.getTasks(filterTaskDto);
  }
  @Get(':id')
  getTaskById(@Param('id') id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }
  @Delete(':id')
  deleteTask(@Param('id') id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: number,
    @Body('status', ValidateTaskStatus) status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status);
  }
}
