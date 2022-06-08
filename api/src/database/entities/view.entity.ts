import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User, Project } from './models';

@Entity()
export class View {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb', { nullable: true })
  selectedSubprojects: object[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.projectfiles)
  user: User;

  @ManyToOne(() => Project, (project) => project.projectfile)
  project: Project;
}
