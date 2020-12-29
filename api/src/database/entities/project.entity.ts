import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Chatroom } from './chatroom.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  owner: number;

  @Column()
  parentProject: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.projects)
  users: User[];

  @OneToOne(() => Chatroom)
  @JoinColumn()
  chatroom: Chatroom;
}
