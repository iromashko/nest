import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [],
  imports: [
    TaskModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'taskmanagement',
      entities: [__dirname + '/../**/*.entity.{js, ts}'],
      synchronize: true,
    }),
  ],
  controllers: [],
})
export class AppModule {}
