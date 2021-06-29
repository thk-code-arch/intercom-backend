// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { Project, Chatroom } from '../entities/models';

define(Project, (faker: typeof Faker) => {
  const newProj = new Project();
  newProj.owner = 1;
  newProj.name = faker.hacker.noun();
  newProj.description = faker.hacker.phrase();

  const newroom = new Chatroom();
  newroom.name = newProj.name;
  newroom.description = newProj.description;
  newroom.project = <any>newProj;
  newroom.roomtype = 'PROJECT';

  return newProj;
});
