import { Module } from '@nestjs/common';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  providers: [TasksService],
  imports: [TasksModule]
})
export class AppModule { }
