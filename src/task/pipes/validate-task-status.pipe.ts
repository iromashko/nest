import { PipeTransform } from '@nestjs/common';

export class ValidateTaskStatus implements PipeTransform {
  transform(value: any) {
    return value;
  }
}
