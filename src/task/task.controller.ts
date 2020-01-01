import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTasksDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';
import { ValidateTaskStatus } from './pipes/validate-task-status.pipe';

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
    @Query(ValidationPipe) filterTasksDto: FilterTasksDto,
  ): Promise<Task[]> {
    return this.taskService.getTasks(filterTasksDto);
  }
  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getTaskById(id);
  }
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ValidateTaskStatus)
    status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status);
  }
  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }
}
