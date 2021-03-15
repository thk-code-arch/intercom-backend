import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { User, Projectfile, Storage, Learning } from './models';

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

  @Column({ nullable: true })
  parentProject: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, (user) => user.projects)
  users: User[];

  @OneToMany(() => Projectfile, (projectfile) => projectfile.project)
  projectfile: Projectfile[];

  @OneToMany(() => Learning, (learning) => learning.project)
  learning: Learning[];

  @OneToMany(() => Storage, (storage) => storage.project)
  storage: Storage[];
}
