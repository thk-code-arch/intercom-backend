// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import {
  User,
  Role,
  Project,
  Avatarfile,
  Projectfile,
  Chatroom,
} from '../entities/models';
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

    const projRepo = connection.getRepository(Project);
    const newProj = new Project();
    newProj.owner = 1;
    newProj.name = 'InterACT';
    newProj.description = 'Laboratory for Architecture, Crafts, Technology';
    const theProject = await projRepo.save(newProj);

    const chatRepo = connection.getRepository(Chatroom);
    const newroom = new Chatroom();
    newroom.name = newProj.name;
    newroom.description = newProj.description;
    newroom.project = <any>newProj;
    newroom.roomtype = 'PROJECT';
    const theRoom = await chatRepo.save(newroom);

    const res3 = await userRepo
      .createQueryBuilder('user')
      .relation(User, 'projects')
      .of(usr)
      .add(theProject);

    const res4 = await userRepo
      .createQueryBuilder('user')
      .relation(User, 'chatrooms')
      .of(usr)
      .add(theRoom);

    const projectFileRepo = connection.getRepository(Projectfile);
    const file = new Projectfile();
    file.filename = 'InterAct.gltf';
    file.path = '/files/input/InterAct.ifc';
    file.project = <any>newProj.id;
    file.user = <any>1;
    await projectFileRepo.save(file);

    const avatarRepo = connection.getRepository(Avatarfile);
    const afile = new Avatarfile();
    afile.filename = 'no1.gltf';
    afile.id = 1;
    afile.path = '/files/avatars/no1.gltf';
    await avatarRepo.save(afile);

    if (process.env.IC_SEEDDEMODATA === 'true') {
      await factory(User)().createMany(3);
      //seeding
    }
    console.log(res2, res3, res4);
  }
}
