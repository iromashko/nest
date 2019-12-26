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
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { Task, TaskStatus } from './task.model';
import { FilterTasksDto } from './dto/filterTasksDto';
import { ValidateTaskStatusPipe } from './pipes/validateTaskStatusPipe';
import { stat } from 'fs';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(@Body(ValidationPipe) createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }
  @Get()
  getTasks(@Query(ValidationPipe) filterTasksDto: FilterTasksDto): Task[] {
    if (Object.keys(filterTasksDto).length) {
      return this.tasksService.getTasksWithFilter(filterTasksDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }
  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }
  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', ValidateTaskStatusPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
  @Delete(':id')
  deleteTask(@Param('id') id: string): {} {
    return this.tasksService.deleteTask(id);
  }
}
