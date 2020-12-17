import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
