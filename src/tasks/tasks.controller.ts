import { Controller, Get, Query, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { FilterTasksDto } from './dto/filterTasks.dto';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/createTask.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(@Query() filterTaskDto: FilterTasksDto): Task[] {
    if (Object.keys(filterTaskDto).length) {
      return this.tasksService.getTasksWithFilter(filterTaskDto);
    } else {
      return this.tasksService.getAllTasks();
    }
  }
  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(":id/status")
  updateTask(@Param("id") id: string, @Body("status") status: TaskStatus): Task {
    return this.tasksService.updateTask(id, status);
  }
  @Delete(":id")
  deleteTask(@Param("id") id: string) {
    this.tasksService.deleteTask(id);
  }
}
