import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(Task) private taskRepository: TaskRepository) {}
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }
  async getTasks(filterTastDto: FilterTaskDto): Promise<Task[]> {
    return await this.taskRepository.getTasks(filterTastDto);
  }
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`${id} task not found`);
    }
    return found;
  }
  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${id} task not found`);
    }
  }
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    found.status = status;
    await found.save();
    return found;
  }
}
