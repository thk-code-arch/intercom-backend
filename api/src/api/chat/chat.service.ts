import { Injectable, Logger } from '@nestjs/common';
import { Chatlog } from '../../database/entities/models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chatlog)
    private readonly chatRepository: Repository<Chatlog>,
  ) {}
  private readonly logger = new Logger(ChatService.name);

  async new_message(
    message: string,
    userid: number,
    roomid: number,
  ): Promise<number> {
    const msg = new Chatlog();
    msg.message = message;
    //  msg.user = roo
    return 1;
  }
}
