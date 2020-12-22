import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Roles } from '../../auth/Roles';
import { Project } from './project.entity';
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

  @Column({ default: Roles.USER })
  role: number;

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  projects: Project[];

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
