import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Chatroom } from './chatroom.entity';
@Entity()
export class Chatlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  time: Date;

  @ManyToOne(() => Chatroom, (chatroom) => chatroom.chatlog)
  room: Chatroom;
}
