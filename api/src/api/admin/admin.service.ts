import { Injectable, Logger, HttpStatus, HttpException } from '@nestjs/common';
import { User, Project, Chatroom } from '../../database/entities/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Chatroom)
    private readonly roomRepository: Repository<Chatroom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  private readonly logger = new Logger(AdminService.name);

  async allUsers() {
    return this.userRepository.find({
      relations: ['projects'],
    });
  }
  async allProjects() {
    return this.projectRepository.find({
      relations: ['users'],
    });
  }
  async allChatrooms() {
    return this.roomRepository.find({
      relations: ['users'],
    });
  }
}
