import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Role, Chatlog, Project, Chatroom, Projectfile } from './models';

import * as bcrypt from 'bcrypt';

export class UserRO {
  id: number;
  email: string;
  username: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 320, unique: true })
  username: string;

  @Column('varchar', { length: 320, unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  profile_image: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  projects: Project[];

  @ManyToMany(() => Chatroom, (chatroom) => chatroom.users)
  @JoinTable()
  chatrooms: Chatroom[];

  @OneToMany(() => Projectfile, (projectfile) => projectfile.user)
  projectfiles: Projectfile[];

  @OneToMany(() => Chatlog, (chatlog) => chatlog.user)
  chatlog: Chatlog[];

  @BeforeInsert()
  async initUser() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken = true): UserRO {
    const { id, username, email } = this;
    const responseObject: UserRO = {
      id,
      username,
      email,
    };

    return responseObject;
  }
}
