import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { LearningService } from './learning.service';
import { UtilsService } from '../../utils/utils.service';
import { videoUrl, NewLearning } from './learning.dto';

@Auth(Roles.USER)
@ApiTags('learning')
@Controller('learning')
export class LearningController {
  constructor(
    private readonly learningService: LearningService,
    private readonly utils: UtilsService,
  ) {}
  private readonly logger = new Logger(LearningController.name);

  @Post('add')
  async addLearning(@Body() newLearning: NewLearning) {
    return newLearning;
  }
  @Post('fetch')
  async fetchVideo(@Body() videoUrl: videoUrl) {
    return await this.utils.fetchVideo(videoUrl.scrapeUrl);
  }
  @Get('public')
  async getPublicLearnings() {
    return this.learningService.listAllPublic();
  }
  @Get('show/:learningId')
  async showLearning() {
    return;
  }
}
