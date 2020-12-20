import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  owner: number;

  @Column()
  parentProject: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => User, user => user.projects)
  users: User[];
}
