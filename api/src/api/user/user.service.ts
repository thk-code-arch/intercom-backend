import { Injectable } from '@nestjs/common';
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

  async create(userDto: CreateUserDto): Promise<UserDto> {
    const { username, password, email } = userDto;

    // check if the user exists in the db
    const userInDb = await this.usersRepository.findOne({ where: { username } });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const user: UserEntity = await this.userRepo.create({
      username,
      password,
      email,
    });

    await this.userRepo.save(user);

    return toUserDto(user);
  }
}
