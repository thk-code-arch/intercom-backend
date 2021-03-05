import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User, Project, Learning } from './models';

@Entity()
export class Storage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  filename: string;

  @Column('varchar', { length: 255 })
  path: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.projectfiles)
  user: User;

  @ManyToOne(() => Project, (project) => project.storage)
  project: Project;

  @ManyToOne(() => Learning, (learning) => learning.storage)
  learning: Learning;
}
