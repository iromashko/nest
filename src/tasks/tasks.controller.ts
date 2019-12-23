import { Controller, Get, Query, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FilterTasksDto } from './dto/filterTasksDto';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/CreateTaskDto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(@Query() filterTasksDto: FilterTasksDto): Task[] {
    if (Object.keys(filterTasksDto).length) {
      return this.tasksService.getTasksWithFilter(filterTasksDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }
  @Get(":id")
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }
  @Patch(":id/status")
  updateTaskStatus(@Param("id") id: string, @Body('status') status: TaskStatus): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
  @Delete(":id")
  deleteTaskById(@Param("id") id: string): Task[] {
    return this.tasksService.deleteTaskById(id);
  }
}
