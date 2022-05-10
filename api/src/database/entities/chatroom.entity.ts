// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Chatlog } from './chatlog.entity';
import { Project } from './project.entity';

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => Project)
  @JoinColumn()
  project: Project;

  @Column()
  roomtype: string;

  @ManyToMany(() => User, (user) => user.chatrooms)
  users: User[];

  @OneToMany(() => Chatlog, (chatlog) => chatlog.room)
  chatlog: Chatlog[];

  @DeleteDateColumn()
  deletedAt: Date;
}
