import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/models';
import { CreateUserDto } from './dto/user.dto';
import { Roles } from '../../auth/Roles';
import { ProjectService } from '../project/project.service';
import { ChatService } from '../chat/chat.service';
import _ = require('lodash');
const gravatar = require('gravatar');
const generator = require('generate-password');

export type Res = any;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly projectService: ProjectService,
    private readonly chatService: ChatService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async findOne(username: string): Promise<Res | undefined> {
    return this.usersRepository.findOne({ where: { username: username } });
  }
  async findOneAuthUser(username: string): Promise<Res | undefined> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username = :username', { username: username })
      .leftJoinAndSelect('user.roles', 'role')
      .getOne();
  }
  async findByUserId(userid: number): Promise<User | undefined> {
    const res = await this.usersRepository.findOne({
      relations: ['roles', 'chatrooms'],
      where: { id: userid },
    });
    //  inject Subprojects
    res.projects = await this.projectService.get_projects_and_subprojects(
      res.id,
    );
    //  inject Subprojects Chatrooms
    const subprojects = _.map(
      res.projects.filter((p) => p.parentProject !== null),
      'id',
    );
    const catcheRooms = await this.chatService.getSubProjectChatrooms(
      subprojects,
    );
    res.chatrooms = [...res.chatrooms, ...catcheRooms];
    console.log(res);
    return res;
  }

  public async signup(
    newuser,
    quite: boolean,
    isAdmin: boolean,
  ): Promise<User> {
    const { email, username, invitecode } = newuser;
    const usr: CreateUserDto = newuser;
    if (invitecode != process.env.IC_Invitecode) {
      throw new HttpException('Wrong Invitecode!', HttpStatus.BAD_REQUEST);
    }
    let user = await this.usersRepository.findOne({
      where: [{ email }, { username }],
    });
    if (user) {
      throw new HttpException(
        'User or Email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    this.logger.debug(usr);
    //add Gravatar
    usr.profile_image = await gravatar.url(
      email,
      { s: '100', r: 'x', d: 'retro' },
      true,
    );
    if (!quite) {
      usr.password = generator.generate({ length: 10, numbers: true });
    }
    if (isAdmin) {
      usr.role = Roles.ADMIN;
    }
    user = this.usersRepository.create(usr);
    const result = await this.usersRepository.save(user);
    result.password = usr.password;
    return result;
  }
}
