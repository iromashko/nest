import { TaskStatus } from '../task-status.enum';
import { IsIn, IsOptional, IsNotEmpty } from 'class-validator';

export class FilterTasksDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
