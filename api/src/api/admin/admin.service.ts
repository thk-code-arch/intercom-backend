import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { User, Project, Chatroom, Role } from '../../database/entities/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { AddUsersByEmail } from './admin.dto';
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

  async allUsers() {
    return this.userRepository.find({
      relations: ['projects', 'roles'],
    });
  }
  async allProjects() {
    return this.projectRepository.find({
      relations: ['users'],
    });
  }
  async allChatrooms() {
    return this.roomRepository.find({
      relations: ['users'],
    });
  }
  async addRole(role, usrid) {
    const roleId = await this.roleRepository.findOne({ where: { name: role } });
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(usrid)
      .add(roleId.id);
    return this.allUsers();
  }
  async rmRole(role, usrid) {
    const roleId = await this.roleRepository.findOne({ where: { name: role } });
    await this.userRepository
      .createQueryBuilder()
      .relation(User, 'roles')
      .of(usrid)
      .remove(roleId.id);
    return this.allUsers();
  }

  async addUserstoProject(emails) {
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
    // TODO: remove loop reverse add relation,, add takes array

    emails.newUsers.forEach(async (newUser) => {
      const newuser = new CreateUserDto();
      newuser.email = newUser;
      newuser.username = newUser.replace(/@[^@]+$/, '');
      newuser.invitecode = process.env.IC_Invitecode;
      const regUser = await this.userService.signup(newuser, false, false);
      this.logger.debug(JSON.stringify(regUser) + 'New User registred');
      this.utils.signup(regUser.email, regUser.username, regUser.password);
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
    });
    return 'true';
  }
}
