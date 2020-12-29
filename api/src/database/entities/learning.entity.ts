import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Learning {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string; // Link, File, ...

  @Column("varchar", { length: 4000 })
  url: string;

  @Column()
  thumbnail: string;

  @Column("varchar", { length: 400 })
  title: string;

  @Column()
  description: string; //user added description

  @Column()
  type: string; // PUBLIC, PROJECT related

  @Column()
  projectid: number; // when project related

  @Column({default: 1})
  views: number; // Count Views
}
