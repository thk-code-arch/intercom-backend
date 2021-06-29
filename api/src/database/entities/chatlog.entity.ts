// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User, Chatroom } from './models';
@Entity()
export class Chatlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @ManyToOne(() => User, (user) => user.chatlog)
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  time: Date;

  @ManyToOne(() => Chatroom, (chatroom) => chatroom.chatlog)
  room: Chatroom;
}
