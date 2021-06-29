// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Storage, User, Project } from './models';

@Entity()
export class Learning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string; // Link, File, ...

  @Column('varchar', { length: 4000 })
  url: string;

  @Column()
  thumbnail: string;

  @Column('varchar', { length: 400 })
  title: string;

  @Column()
  description: string; //user added description

  @Column()
  type: string; // PUBLIC, PROJECT related

  @ManyToOne(() => Project, (project) => project.learning)
  project: Project;

  @Column({ default: 1 })
  views: number; // Count Views

  @OneToMany(() => Storage, (storage) => storage.learning)
  storage: Storage[];

  @ManyToOne(() => User, (user) => user.learning)
  user: User;
}
