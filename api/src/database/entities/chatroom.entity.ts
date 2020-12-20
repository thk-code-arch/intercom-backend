import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { length: 100 })
  name: string;

  @Column()
  description: string;

  @Column()
  projectid: number;

  @Column()
  roomtype: string;
}
