import { User } from '../entities/user.entity';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Roles } from '../../auth/Roles';
const gravatar = require('gravatar');

export default class Initial implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const profile_image = gravatar.url(
      process.env.IC_ADMIN_MAIL,
      { s: '100', r: 'x', d: 'retro' },
      true,
    );
    // add Admin User
    const user = new User();
    user.username = process.env.IC_ADMIN_USERNAME;
    user.password = process.env.IC_ADMIN_PASSWORD;
    user.email = process.env.IC_ADMIN_MAIL;
    user.role = (Roles.ADMIN, Roles.USER);
    user.profile_image = profile_image;
    const userRepo = connection.getRepository(User);
    const usr = userRepo.create(user);
    await userRepo.save(usr);

    if (process.env.IC_SEEDDEMODATA === 'true') {
      await factory(User)().createMany(10);
    }
  }
}
