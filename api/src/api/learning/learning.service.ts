import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { NewLearning, UpdateLearning } from './project.dto';
import { User, Learning } from '../../database/entities/models';
import { NewLearning } from './learning.dto';

@Injectable()
export class LearningService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(User)
    private readonly learningRepository: Repository<Learning>,
  ) {}
  private readonly logger = new Logger(LearningService.name);

  async listAllPublic(): Promise<Learning[] | undefined> {
    return this.learningRepository.find({ where: { type: 'PUBLIC' } });
  }
  async addLearning(newlearning: NewLearning): Promise<Learning | undefined> {
    return this.learningRepository.create(newlearning);
  }
}
