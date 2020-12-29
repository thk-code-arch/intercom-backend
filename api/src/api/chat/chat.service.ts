import { Injectable, Logger } from '@nestjs/common';
import {
  User,
  Project,
  Chatroom,
  Chatlog,
} from '../../database/entities/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chatlog)
    private readonly chatRepository: Repository<Chatlog>,
    @InjectRepository(Chatroom)
    private readonly roomRepository: Repository<Chatroom>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  private readonly logger = new Logger(ChatService.name);

  async new_message(
    message: string,
    userid: number,
    roomid: number,
  ): Promise<number> {
    const msg = new Chatlog();
    msg.message = message;
    msg.room = Chatroom.id;
    //  msg.user = roo
    return 1;
  }
  async getRoomByProjectId(projectid: number) {}

  async getChatroomsByUserId(userid: number) {}

  async getUsersByChatroom() {}

  async getChatlogHistoryByChatroom() {}
}
