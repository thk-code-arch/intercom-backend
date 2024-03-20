// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/models';
import {
  CreateUserDto,
  PasswordResetStatus,
  UpdateUserProfile,
} from './dto/user.dto';
import { ProjectService } from '../project/project.service';
import { ChatService } from '../chat/chat.service';
import _ = require('lodash');
const gravatar = require('gravatar');
const generator = require('generate-password');
import { Raw } from 'typeorm';

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
    if (!res) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    //  inject Subprojects
    res.projects = await this.projectService.get_projects_and_subprojects(
      res.id,
    );
    //  inject Subprojects Chatrooms
    const subprojects = _.map(
      res.projects.filter((p) => p.parentProject !== null),
      'id',
    );
    if (Array.isArray(subprojects) && subprojects.length) {
      const catcheRooms =
        await this.chatService.getSubProjectChatrooms(subprojects);
      res.chatrooms = [...res.chatrooms, ...catcheRooms];
    }
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
    //add Gravatar
    usr.profile_image = await gravatar.url(
      email,
      { s: '100', r: 'x', d: 'retro' },
      true,
    );
    if (!quite) {
      usr.password = generator.generate({ length: 10, numbers: true });
    }
    usr.role = 1;

    this.logger.debug(usr);

    const assignedRoles = isAdmin ? [1, 2] : [1];

    user = this.usersRepository.create(usr);
    const result = await this.usersRepository.save(user);

    await this.usersRepository
      .createQueryBuilder('user')
      .relation(User, 'roles')
      .of(result)
      .add(assignedRoles);

    result.password = usr.password;
    return result;
  }

  async setPassword(usrId: number, newPassword: string): Promise<User | void> {
    const getUser = await this.usersRepository.findOne({
      where: { id: usrId },
    });
    getUser.password = newPassword;
    return await this.usersRepository.save(getUser);
  }

  async updateProfileImage(
    usrId: number,
    profileImageUrl: string,
  ): Promise<User | void> {
    const getUser = await this.usersRepository.findOne({
      where: { id: usrId },
    });
    getUser.profile_image = profileImageUrl;
    return await this.usersRepository.save(getUser);
  }

  async updateProfile(
    usrId: number,
    profile: UpdateUserProfile,
  ): Promise<User | void> {
    const updateUser = await this.usersRepository.findOne({
      where: { id: usrId },
    });
    updateUser.username = profile.username;
    updateUser.email = profile.email;
    return await this.usersRepository.save(updateUser);
  }

  async getProfile(usrId: number): Promise<User | void> {
    return this.usersRepository.findOne({
      where: { id: usrId },
    });
  }

  async resetPassword(email: string): Promise<PasswordResetStatus | undefined> {
    // Use TypeORM's `where` with parameters to prevent SQL injection
    const getUser = await this.usersRepository.findOne({
      where: {
        email: Raw((alias) => `LOWER(${alias}) = LOWER(:email)`, { email }),
      },
    });

    this.logger.log(getUser);

    if (!getUser) {
      // Handle the case where the user is not found
      return undefined;
    }

    // Proceed with password reset
    const genPassword = await generator.generate({ length: 10, numbers: true });
    getUser.password = genPassword;
    const user = await this.usersRepository.save(getUser);

    return {
      username: user.username,
      email: user.email,
      newPassword: genPassword,
    };
  }
}
