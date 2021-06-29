// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatarfile } from '../../database/entities/models';
import _ = require('lodash');

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatarfile)
    private readonly avatarRepository: Repository<Avatarfile>,
  ) {}

  async getAvatarfile(sP: number): Promise<Avatarfile | undefined> {
    return this.avatarRepository
      .createQueryBuilder('avatarfile')
      .where('avatarfile.id= :avatarId ', { avatarId: sP })
      .getOneOrFail();
  }
}
