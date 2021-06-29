// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Roles } from '../../auth/Roles';
import { ApiTags } from '@nestjs/swagger';
import { LearningService } from './learning.service';
import { UtilsService } from '../../utils/utils.service';
import { VideoUrl, NewLearning } from './learning.dto';
import { CurrentUser } from '../../auth/decorators/user.decorator';

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
  async addLearning(
    @Body() newLearning: NewLearning,
    @CurrentUser('id') userId: number,
  ) {
    return this.learningService.addLearning(newLearning, userId);
  }

  @Post('fetch')
  async fetchVideo(@Body() videoUrl: VideoUrl) {
    return await this.utils.fetchVideo(videoUrl.scrapeUrl);
  }

  @Get('public')
  async getPublicLearnings() {
    return this.learningService.listAllPublic();
  }

  @Get('show/:learningId')
  async showLearning(@Param('learningId') learningId: number) {
    return this.learningService.getLearningById(learningId);
  }
}
