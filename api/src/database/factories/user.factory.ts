// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User, Role } from '../entities/models';
const gravatar = require('gravatar');

define(User, (faker: typeof Faker) => {
  const role1 = new Role();
  role1.name = 'user';
  role1.id = 1;

  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const randomEmail = faker.internet.email();
  const profile_image = gravatar.url(
    randomEmail,
    { s: '100', r: 'x', d: 'retro' },
    true,
  );

  const user = new User();
  user.username = `${firstName}${lastName}`;
  user.password = faker.random.word();
  user.email = `${user.username.toLowerCase()}@bim-cloud.org`;
  user.profile_image = profile_image;
  user.roles = [role1];
  return user;
});
