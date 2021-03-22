import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { NewStorage, UpdateStorage } from './project.dto';
import { User, Storage } from '../../database/entities/models';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}
  private readonly logger = new Logger(StorageService.name);
  async uploadScreenshot() {}
}
