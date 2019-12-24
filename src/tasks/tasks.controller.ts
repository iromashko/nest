import { Controller, Post, Body, Get, Query, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/createTaskDto';
import { Task, TaskStatus } from './task.model';
import { FilterTasksDto } from './dto/filterTasksDto';
import { TaskStatusValidationPipe } from './pipes/tasksStatusValidationPipe';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) { }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.taskService.createTask(createTaskDto);
  }
  @Get()
  getTasks(@Query(ValidationPipe) filterTaskDto: FilterTasksDto): Task[] {
    if (Object.keys(filterTaskDto).length) {
      return this.taskService.getTaskWithFilter(filterTaskDto);
    } else {
      return this.taskService.getAllTasks();
    }
  }
  @Patch(":id/status")
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus): Task {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Delete(":id")
  deleteTask(@Param('id') id: string): Task[] {
    return this.taskService.deleteTask(id);
  }

  @Get(":id")
  getTask(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }
}
