// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable, Logger } from '@nestjs/common';
import { User, Project, Chatroom, Role } from '../../database/entities/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddUsersByEmail, AddUserById } from './admin.dto';
import { UserService } from '../user/user.service';
import { UtilsService } from '../../utils/utils.service';
import { CreateUserDto } from '../user/dto/user.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly roomRepository: Repository<Chatroom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
    private readonly utils: UtilsService,
  ) {}
  private readonly logger = new Logger(AdminService.name);

  async allUsers(): Promise<User[] | undefined> {
    return this.userRepository.find({
      relations: ['projects', 'roles'],
    });
  }
  async allProjects(): Promise<Project[] | undefined> {
    return this.projectRepository.find({
      where: { parentProject: null },
      relations: ['users'],
    });
  }
  async allChatrooms() {
    return this.roomRepository.find({
      relations: ['users'],
    });
  }
  async addRole(role: string, usrid: number): Promise<User[] | undefined> {
    const roleId = await this.roleRepository.findOne({ where: { name: role } });
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(usrid)
      .add(roleId.id);
    return this.allUsers();
  }
  async rmRole(role: string, usrid: number): Promise<User[] | undefined> {
    const roleId = await this.roleRepository.findOne({ where: { name: role } });
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(usrid)
      .remove(roleId.id);
    return this.allUsers();
  }

  async addUsersByIdToProject(
    addUser: AddUserById,
  ): Promise<Project[] | undefined> {
    const chatroomId = await this.roomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.projectId = :projectid ', {
        projectid: addUser.projectId,
      })
      .select(['chatroom.id'])
      .getOneOrFail();

    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'projects')
      .of(addUser.userId)
      .add(addUser.projectId);

    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'chatrooms')
      .of(addUser.userId)
      .add(chatroomId);
    return this.allProjects();
  }

  async addUserstoProject(
    emails: AddUsersByEmail,
  ): Promise<Project[] | undefined> {
    const chatroomId = await this.roomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.projectId = :projectid ', {
        projectid: emails.projectId,
      })
      .select(['chatroom.id'])
      .getOneOrFail();
    if (emails.email) {
      const userIds = await this.userRepository
        .createQueryBuilder()
        .where('User.email IN (:...mails)', { mails: emails.email })
        .getMany();
      userIds.forEach(async (usr) => {
        console.log(usr);
        await this.userRepository
          .createQueryBuilder()
          .relation(User, 'projects')
          .of(usr.id)
          .add(emails.projectId);
        await this.userRepository
          .createQueryBuilder()
          .relation(User, 'chatrooms')
          .of(usr.id)
          .add(chatroomId);
      });
    }
    console.log(emails.newUsers);
    if (Array.isArray(emails.newUsers)) {
      emails.newUsers.forEach(async (newUsr) => {
        //cleanup Username :string for new lines etc.
        const newUser = newUsr.replace(/(\r\n|\n|\r)/gm, '');
        const newuser = new CreateUserDto();
        newuser.email = newUser;
        newuser.username = newUser.replace(/@[^@]+$/, '');
        newuser.invitecode = process.env.IC_Invitecode;
        await this.userService
          .signup(newuser, false, false)
          .then(async (regUser) => {
            this.logger.debug(JSON.stringify(regUser) + 'New User registred');
            this.utils.signup(
              regUser.email,
              regUser.username,
              regUser.password,
            );
            await this.userRepository
              .createQueryBuilder()
              .relation(User, 'projects')
              .of(regUser.id)
              .add(emails.projectId);
            await this.userRepository
              .createQueryBuilder()
              .relation(User, 'chatrooms')
              .of(regUser.id)
              .add(chatroomId);
          })
          .catch((err) => {
            this.logger.log(err);
          });
      });
    }
    return this.allProjects();
  }
}
