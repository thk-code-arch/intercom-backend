import { Roles } from '../../auth/Roles';
import * as Faker from "faker"
import { define } from "typeorm-seeding"
import { User } from "../entities/user.entity"
var gravatar = require('gravatar');

define(User, (faker: typeof Faker) => {

  const gender = faker.random.number(1)
  const firstName = faker.name.firstName(gender)
  const lastName = faker.name.lastName(gender)
  const randomEmail = faker.internet.email()
  const profile_image = gravatar.url(randomEmail, {s: '100', r: 'x', d: 'retro'}, true);

  const user = new User()
  user.username = `${firstName}${lastName}`
  user.password = faker.random.word()
  user.email = `${user.username.toLowerCase()}@bim-cloud.org`
  user.role = Roles.USER
  user.profile_image = profile_image
  return user
})
