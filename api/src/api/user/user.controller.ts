import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { createIssue, SetPassword } from './dto/user.dto';
import { UtilsService } from '../../utils/utils.service';
import { UserService } from './user.service';
import { CurrentUser } from '../../auth/decorators/user.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly utils: UtilsService,
    private readonly user: UserService,
  ) {}

  @Post('create_issue')
  @Auth(Roles.USER)
  async createIssue(@Body() issue: createIssue) {
    return this.utils.createIssue(issue);
  }

  @Post('update_password')
  @Auth(Roles.USER)
  async updatePassword(
    @Body() passw: SetPassword,
    @CurrentUser('id') usrId: number,
  ) {
    return this.user.setPassword(usrId, passw.newPassword);
  }
}
