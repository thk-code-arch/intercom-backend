import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Chatlog } from './chatlog.entity';

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  projectid: number;

  @Column()
  roomtype: string;

  @ManyToMany(() => User, (user) => user.chatrooms)
  users: User[];

  @OneToMany(() => Chatlog, (chatlog) => chatlog.roomid)
  chatlog: Chatlog[];
}
