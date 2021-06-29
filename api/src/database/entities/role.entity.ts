// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Column, Entity, PrimaryColumn, ManyToMany } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Role {
  @PrimaryColumn()
  id: number;

  @Column('varchar', { length: 10 })
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
