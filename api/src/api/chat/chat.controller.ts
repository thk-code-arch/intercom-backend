import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@Auth(Roles.USER)
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('log/:chatroomid')
  async getChatlogbyRoomId(
    @CurrentUser('chatrooms') usrrooms: number[],
    @Param('chatroomid') chatroomid: number,
  ) {
    return this.chatService.getChatLog(chatroomid, usrrooms);
  }

  @Get('get_chatrooms')
  async getChatrooms(@CurrentUser('id') usrid: number) {
    return this.chatService.getChatroomsByUserId(usrid);
  }

  @Get('msgbyid/:msgid')
  async getMessagebyId(
    @CurrentUser('chatrooms') userrooms: [],
    @Param() params,
  ) {
    return this.chatService.getMsgById(params.msgid, userrooms);
  }

  @Get('get_projectroom/:projectId')
  async getProjectroom(
    @Param() params,
    @CurrentUser('chatrooms') userrooms: number[],
  ) {
    return this.chatService.getRoomByProjectId(params.projectId, userrooms);
  }
}
