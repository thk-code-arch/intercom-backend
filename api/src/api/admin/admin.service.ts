import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { User, Project, Chatroom, Role } from '../../database/entities/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    console.log(emails);
    const chatroomId = await this.roomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.projectId = :projectid ', {
        projectid: emails.projectId,
      })
      .select(['chatroom.id'])
      .getOneOrFail();
    const userIds = await this.userRepository
      .createQueryBuilder()
      .where('User.email IN (:...mails)', { mails: emails.email })
      .getMany();
    console.log(userIds);
    userIds.forEach((usr) => {
      console.log(usr);
      this.userRepository
        .createQueryBuilder()
        .relation(User, 'projects')
        .of(usr.id)
        .add(emails.projectId);
      this.userRepository
        .createQueryBuilder()
        .relation(User, 'chatrooms')
        .of(usr.id)
        .add(chatroomId);
    });
    return 'true';
  }
}
