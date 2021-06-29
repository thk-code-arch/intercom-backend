// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './models';

@Entity()
export class Avatarfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255 })
  filename: string;

  @Column('varchar', { length: 255 })
  path: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => User, (user) => user.avatarfile)
  users: User[];
}
