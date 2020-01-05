import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { TaskStatus } from './task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: TaskStatus;

  @Column()
  userId: number;

  @ManyToOne(
    type => User,
    user => user.tasks,
    { eager: false },
  )
  user: User;
}
