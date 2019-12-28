import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  ValidationPipe,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { FilterTasksDto } from './dto/filterTasksDto';
import { ValidateTaskStatusPipe } from './pipes/validateTaskStatusPipe';
import { Task } from './task.entity';
import { TaskStatus } from './task.status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get()
  getTasks(
    @Query(ValidationPipe) filterTasksDto: FilterTasksDto,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(filterTasksDto);
  }

  @Get(':id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }
  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ValidateTaskStatusPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
