import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { FilterTasksDto } from './dto/filter-task.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('task repository');
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error('server error');
      throw new InternalServerErrorException();
    }
    delete task.user;
    return task;
  }
  async getTasks(filterTasksDto: FilterTasksDto, user: User): Promise<Task[]> {
    const { status, search } = filterTasksDto;
    const query = this.createQueryBuilder('task');
    query.where(`task.userId = :userId`, { userId: user.id });
    if (status) {
      query.andWhere(`task.status = :status`, { status });
    }
    if (search) {
      query.andWhere(
        `task.title LIKE :search OR task.description LIKE :search`,
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
