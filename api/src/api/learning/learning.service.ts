import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { NewLearning, UpdateLearning } from './project.dto';
import { User } from '../../database/entities/models';

@Injectable()
export class LearningService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // @InjectRepository(Learning) // private readonly projectsRepository: Repository<Learning>, // @InjectRepository(Chatroom) // private readonly chatroomRepository: Repository<Chatroom>, // @InjectRepository(Learningfile) // private readonly fileRepository: Repository<Learningfile>,
  ) {}
  private readonly logger = new Logger(LearningService.name);
}
