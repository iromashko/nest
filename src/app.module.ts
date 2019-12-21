import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TasksService } from './tasks/tasks.service';

@Module({
  providers: [TasksService],
  imports: [TasksModule]
})
export class AppModule { }
