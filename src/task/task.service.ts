import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './task.entity';
import { FilterTasksDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
  async getTasks(filterTasksDto: FilterTasksDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterTasksDto);
  }
  async getTaskById(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`${id} task not found`);
    }
    return task;
  }
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${id} task not found`);
    }
  }
}
