import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/user.dto';

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
  public async signup(userDto: CreateUserDto): Promise<User> {
    const { email,username, invitecode } = userDto;

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
    user = await this.usersRepository.create(userDto);
    return await this.usersRepository.save(user);
  }
}
