import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/createTaskDto';
import uuid = require('uuid');
import { FilterTasksDto } from './dto/filterTasksDto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN
    };
    this.tasks.push(task);
    return task;
  }
  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTaskWithFilter(filterTaskDto: FilterTasksDto): Task[] {
    const { status, search } = filterTaskDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));
    }
    return tasks;
  }
  getTaskById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
    return found;
  }
  updateTaskStatus(id: string, status: TaskStatus): Task {
    let task = this.getTaskById(id);
    task.status = status;
    return task;
  }
  deleteTask(id: string): Task[] {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter(task => task.id !== found.id);
    return this.tasks;
  }

}
