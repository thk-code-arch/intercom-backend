// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

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

  @Column()
  category: string; // Screenshot, Project Attachments

  @Column()
  filepath: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  description: string; //user added description

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.projectfiles)
  user: User;

  @ManyToOne(() => Project, (project) => project.storage)
  project: Project;

  @ManyToOne(() => Learning, (learning) => learning.storage)
  learning: Learning;
}
