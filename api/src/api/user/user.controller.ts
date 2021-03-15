import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { createIssue } from './dto/user.dto';
import { UtilsService } from '../../utils/utils.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly utils: UtilsService) {}

  @Post('create_issue')
  @Auth(Roles.USER)
  async createIssue(@Body() issue: createIssue) {
    return this.utils.createIssue(issue);
  }
}
