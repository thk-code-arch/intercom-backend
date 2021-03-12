import { Injectable, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(AvatarService.name);

  async getAvatarfile(sP: number): Promise<Avatarfile | undefined> {
    return await this.avatarRepository
      .createQueryBuilder('avatarfile')
      .where('avatarfile.id= :avatarId ', { avatarId: sP })
      .getOneOrFail();
  }
}
