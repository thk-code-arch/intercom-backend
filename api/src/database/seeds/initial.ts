import { User, Role, Project } from '../entities/models';
import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
const gravatar = require('gravatar');

export default class Initial implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    // add Roles

    const role1 = new Role();
    role1.name = 'user';
    role1.id = 1;
    await connection.manager.save(role1);

    const role2 = new Role();
    role2.name = 'admin';
    role2.id = 2;
    await connection.manager.save(role2);

    // add Admin User

    const profile_image = gravatar.url(
      process.env.IC_ADMIN_MAIL,
      { s: '100', r: 'x', d: 'retro' },
      true,
    );

    const user = new User();
    user.username = process.env.IC_ADMIN_USERNAME;
    user.password = process.env.IC_ADMIN_PASSWORD;
    user.email = process.env.IC_ADMIN_MAIL;
    user.profile_image = profile_image;
    const userRepo = connection.getRepository(User);
    let usr = userRepo.create(user);
    usr = await userRepo.save(usr);
    const res2 = await userRepo
      .createQueryBuilder('user')
      .relation(User, 'roles')
      .of(usr)
      .add([role1, role2]);

    if (process.env.IC_SEEDDEMODATA === 'true') {
      await factory(User)().createMany(3);
      await factory(Project)().createMany(2);
    }
  }
}
