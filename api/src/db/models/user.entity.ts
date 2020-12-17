import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 320 })
  username: string;

  @Column("varchar", { length: 320 })
  email: string;

  @Column()
  password: string;

  @Column()
  profile_image: string;

  @Column({ default: true })
  isActive: boolean;
}
