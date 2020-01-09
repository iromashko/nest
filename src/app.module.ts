import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';

@Module({
  providers: [],
  imports: [
    TaskModule,
    AuthModule,
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
