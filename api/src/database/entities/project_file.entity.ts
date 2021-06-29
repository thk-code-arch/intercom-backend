// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User, Project } from './models';

@Entity()
export class Projectfile {
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

  @ManyToOne(() => Project, (project) => project.projectfile)
  project: Project;
}
