// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  ManyToOne,
  OneToMany,
  JoinTable,
} from 'typeorm';
import {
  Role,
  Chatlog,
  Project,
  Chatroom,
  Avatarfile,
  Projectfile,
  Learning,
} from './models';

import * as bcrypt from 'bcryptjs';

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

  // TODO remove User email from select
  //  don't expose sensitive data in qeuries.

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

  @ManyToOne(() => Avatarfile, (avatarfile) => avatarfile.users)
  avatarfile: Avatarfile;

  @OneToMany(() => Chatlog, (chatlog) => chatlog.user)
  chatlog: Chatlog[];

  @OneToMany(() => Learning, (learning) => learning.user)
  learning: Learning[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async lowerEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return bcrypt.compare(attempt, this.password);
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
