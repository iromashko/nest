import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../task.model";


export class ValidateTaskStatusPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ];
  transform(value: string) {
    value = value.toUpperCase().trim();
    if (!this.statusIsValid(value)) {
      throw new BadRequestException(`${value} status invalid`);
    }
    return value;
  }
  statusIsValid(value: any): Boolean {
    const idx = this.allowedStatuses.indexOf(value);
    return idx !== -1;
  }
}