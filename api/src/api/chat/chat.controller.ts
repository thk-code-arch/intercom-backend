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
import { ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@Auth(Roles.USER)
@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('getchatrooms')
  async getChatrooms(@CurrentUser('id') usrid: number) {
    return this.chatService.getChatroomsByUserId(usrid);
  }

  @Get('getprojectroom/:projectId')
  async getProjectroom(@Param() params) {
    return this.chatService.getRoomByProjectId(params.projectId);
  }
}
