import { Injectable, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { Roles } from '../../auth/Roles';
const gravatar = require('gravatar');
const generator = require('generate-password');

export type Res = any;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
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
    return this.usersRepository.findOne({
      relations: ['roles'],
      where: { id: userid },
    });
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
      this.logger.debug(usr.password);
      // TODO send mail with password
    }
    if (isAdmin) {
      usr.role = Roles.ADMIN;
    }
    user = this.usersRepository.create(usr);
    return await this.usersRepository.save(user);
  }
}
