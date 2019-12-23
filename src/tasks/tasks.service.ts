import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { FilterTasksDto } from './dto/filterTasksDto';
import { CreateTaskDto } from './dto/CreateTaskDto';
import * as uuid from 'uuid';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
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
  getTasksWithFilter(filterTasksDto: FilterTasksDto): Task[] {
    const { status, search } = filterTasksDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(task =>
        task.title.includes(search) ||
        task.description.includes(search)
      );
    }
    return tasks;
  }

  deleteTaskById(id: string): Task[] {
    this.tasks = this.tasks.filter(task => task.id !== id);
    return this.tasks;
  }
  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

}
