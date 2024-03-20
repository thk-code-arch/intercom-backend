// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

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
    @InjectRepository(Learning)
    private readonly learningRepository: Repository<Learning>,
  ) {}
  private readonly logger = new Logger(LearningService.name);

  async listAllPublic(): Promise<Learning[] | undefined> {
    return this.learningRepository.find({ where: { type: 'PUBLIC' } });
  }
  async addLearning(
    newlearning: NewLearning,
    userId: number,
  ): Promise<Learning | undefined> {
    const learning = new Learning();
    Object.assign(learning, newlearning);
    learning.user = <any>userId;
    return this.learningRepository.save(learning);
  }
  async getLearningById(learningId: any) {
    // TODO <startup>: check for bug
    return this.learningRepository.findOne(learningId);
  }
}
