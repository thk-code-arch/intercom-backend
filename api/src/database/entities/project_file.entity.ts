import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Project } from './project.entity';

@Entity()
export class Projectfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  filename: string;

  @Column('varchar', { length: 255 })
  path: string;

  @ManyToOne(() => User, (user) => user.projectfiles)
  user: User;

  @OneToOne(() => Project)
  @JoinColumn()
  project: Project;
}
