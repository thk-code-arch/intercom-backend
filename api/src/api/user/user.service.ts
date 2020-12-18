import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.dto';
import { Roles } from '../../auth/Roles';
var gravatar = require('gravatar');
var generator = require('generate-password');

export type Res = any;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<Res | undefined> {
    return this.usersRepository.findOne({ where:{ username: username }});
  }
  async findByUserId(userid: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where:{ id: userid }});
  }

  public async signup(newuser, quite: boolean, isAdmin: boolean): Promise<User> {
    const { email, username, invitecode } = newuser;
    let usr :CreateUserDto  = newuser;
    if (invitecode != process.env.IC_Invitecode){
      throw new HttpException(
        'Wrong Invitecode!',
        HttpStatus.BAD_REQUEST,
      );
    }
    let user = await this.usersRepository.findOne({ where: [{ email},{username }] });
    if (user) {
      throw new HttpException(
        'User or Email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    //add Gravatar
    usr.profile_image = await gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, true);
    if(!quite){
    usr.password = generator.generate({length: 10,numbers:true});
    console.log(usr.password)
    // TODO send mail with password
    }
    if(isAdmin){
      usr.role = Roles.ADMIN
    }
    user = this.usersRepository.create(usr);
    return await this.usersRepository.save(user);
  }
}