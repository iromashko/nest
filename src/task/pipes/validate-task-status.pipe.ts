import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class ValidateTaskStatus implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: any) {
    value = value.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${status} invalid`);
    }
    return value;
  }
  private isStatusValid(value: any): boolean {
    const idx = this.allowedStatuses.indexOf(value);
    return idx !== -1;
  }
}
