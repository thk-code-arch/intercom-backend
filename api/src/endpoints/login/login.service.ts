import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../db/models/user.entity';

export type Res = any;

@Injectable()
export class LoginService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
  }

  async findOne(username: string): Promise<Res | undefined> {
    return this.usersRepository.findOne(username);
  }
}
