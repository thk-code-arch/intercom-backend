// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../api/user/user.service';
import { User, Project } from '../database/entities/models';
import { AdminService } from '../api/admin/admin.service';
import { UtilsService } from '../utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import {
  SignupwithInvite,
  RegistrationStatus,
  DemoRegistrationStatus,
} from '../api/user/dto/user.dto';
import * as bcrypt from 'bcryptjs';
import _ = require('lodash');
import * as faker from 'faker';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    private readonly utils: UtilsService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOneAuthUser(username);
    if (!user) {
      throw new HttpException('Authentication failed!', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(
    signupwithInvite: SignupwithInvite,
  ): Promise<RegistrationStatus> {
    let status: RegistrationStatus = {
      success: true,
      message: 'user registered',
    };

    try {
      const res = await this.userService.signup(signupwithInvite, false, false);
      this.logger.log(JSON.stringify(res) + 'New User registred');
      this.utils.signup(res.email, res.username, res.password);
    } catch (err) {
      this.logger.error('Registrations fails');
      status = {
        success: false,
        message: err,
      };
    }
    return status;
  }
  async getUserDatafromJWT(token: string) {
    const payload = this.jwtService.decode(token);
    return this.userService.findByUserId(payload.sub);
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_image: user.profile_image,
      roles: _.map(user.roles, 'name'),
      accessToken: this.jwtService.sign(payload),
    };
  }
  async passwordReset(email: string): Promise<string> {
    const user = await this.userService.resetPassword(email);
    console.log(user);
    this.utils.resetPassword(user.email, user.username, user.newPassword);
    return 'Check your mailbox';
  }

  async createDemoAccount(invitecode: string): Promise<DemoRegistrationStatus> {
    let status: DemoRegistrationStatus = {
      success: true,
      message: 'user registered',
      username: await faker.name.findName().replace(' ', ''),
      password: '',
    };

    try {
      const res = await this.userService.signup(
        {
          username: status.username,
          invitecode: invitecode,
          email: await faker.internet.email(
            status.username,
            '+demo',
            process.env.IC_CORS,
          ),
        },
        false,
        true,
        //changed last argument demo account with admin permissions for everyone
      );
      this.logger.log(JSON.stringify(res) + 'New User registred');
      status.password = res.password;
      // Add Demo User to all existing projects
      const projects = await this.adminService.allProjects();
      this.logger.log(JSON.stringify(res));

      projects.forEach(async (project) => {
        await this.adminService.addUsersByIdToProject({
          userId: res.id,
          projectId: project.id,
        });
      });
    } catch (err) {
      this.logger.error('Registrations fails');
      status = {
        success: false,
        message: err,
        username: '',
        password: '',
      };
    }
    return status;
  }
}
