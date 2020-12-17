import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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
