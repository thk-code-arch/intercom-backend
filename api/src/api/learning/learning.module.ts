// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningController } from './learning.controller';
import { UtilsModule } from '../../utils/utils.module';
import { User, Learning } from '../../database/entities/models';

@Module({
  imports: [UtilsModule, TypeOrmModule.forFeature([User, Learning])],
  providers: [LearningService],
  controllers: [LearningController],
  exports: [LearningService],
})
export class LearningModule {}
