import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { FilterTasksDto } from './dto/filterTasks.dto';
import { CreateTaskDto } from './dto/createTask.dto';
import uuid = require('uuid');

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTasksWithFilter(filterTaskDto: FilterTasksDto): Task[] {
    const { status, search } = filterTaskDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = this.tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = this.tasks.filter(task => task.title.includes(search) || task.description.includes(search));
    }
    return tasks;
  }
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
  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }
  updateTask(id: string, status: TaskStatus): Task {
    let task = this.getTaskById(id);
    task.status = status;
    return task;
  }
  deleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return this.tasks;
  }
}
