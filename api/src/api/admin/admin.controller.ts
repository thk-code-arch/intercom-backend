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
import { AdminService } from './admin.service';

@Auth(Roles.ADMIN)
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('get_users')
  async getUsers() {
    return this.adminService.allUsers();
  }
  @Get('get_projects')
  async getProjects() {
    return this.adminService.allProjects();
  }
  @Get('get_chatrooms')
  async getChatrooms() {
    return this.adminService.allChatrooms();
  }
}
