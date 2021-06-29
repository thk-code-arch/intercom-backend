// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable } from '@nestjs/common';
import { User, Chatroom, Chatlog } from '../../database/entities/models';
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
  ) {}

  async new_message(
    message: string,
    userid: number,
    roomid: number,
  ): Promise<Chatlog | undefined> {
    const msg = new Chatlog();
    msg.message = message;
    msg.room = <any>roomid;
    msg.user = <any>userid;
    return this.chatRepository.save(msg);
  }
  async getRoomByProjectId(
    projectid: number,
    userrooms: number[],
  ): Promise<Chatroom | undefined> {
    const res = await this.roomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.projectId = :projectid ', { projectid: projectid })
      .andWhere('chatroom.id IN (:...userrooms)', { userrooms: userrooms })
      .select(['chatroom.id'])
      .getOneOrFail();
    return res;
  }

  async getSubProjectChatrooms(
    projectids: number[],
  ): Promise<Chatroom[] | undefined> {
    return this.roomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.projectId IN (:...manyprojects) ', {
        manyprojects: projectids,
      })
      .getMany();
  }

  async getMsgById(
    msgid: number,
    userrooms: number[],
  ): Promise<Chatlog | undefined> {
    return this.chatRepository
      .createQueryBuilder('chatlog')
      .where('chatlog.id = :msgid ', { msgid: msgid })
      .andWhere('chatroom.id IN (:...userrooms)', { userrooms: userrooms })
      .leftJoinAndSelect('chatlog.user', 'user')
      .leftJoinAndSelect('chatlog.room', 'chatroom')
      .select([
        'user.username',
        'user.profile_image',
        'chatlog.time',
        'chatlog.id',
        'chatlog.message',
        'chatroom.id',
      ])
      .getOneOrFail();
  }

  async getChatLog(
    chatroomid: number,
    userrooms: number[],
  ): Promise<Chatroom | undefined> {
    return this.roomRepository
      .createQueryBuilder('chatroom')
      .where('chatroom.id = :chatid ', { chatid: chatroomid })
      .andWhere('chatroom.id IN (:...userrooms)', { userrooms: userrooms })
      .leftJoinAndSelect('chatroom.chatlog', 'chatlog')
      .leftJoinAndSelect('chatlog.user', 'user')
      .getOneOrFail();
  }
  async getChatroomsByUserId(userid: number): Promise<User[] | undefined> {
    return this.userRepository.find({
      where: { id: userid },
      relations: ['chatrooms'],
    });
  }
}
