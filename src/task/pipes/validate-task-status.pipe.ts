import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class ValidateTaskStatus implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
  ];

  transform(value: any) {
    value = value.toUpperCase().trim();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} status invalid`);
    }
    return value;
  }
  private isStatusValid(value: any): boolean {
    const idx = this.allowedStatuses.indexOf(value);
    return idx !== -1;
  }
}
