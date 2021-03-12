import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { NewStorage, UpdateStorage } from './project.dto';
import { User, Chatroom, Storage } from '../../database/entities/models';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, // @InjectRepository(Storage) // private readonly projectsRepository: Repository<Storage>, // @InjectRepository(Chatroom) // private readonly chatroomRepository: Repository<Chatroom>, // @InjectRepository(Storagefile) // private readonly fileRepository: Repository<Storagefile>,
  ) {}
  private readonly logger = new Logger(StorageService.name);
}
