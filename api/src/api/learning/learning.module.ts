import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LearningController } from './learning.controller';

import { User, Learning } from '../../database/entities/models';

@Module({
  imports: [TypeOrmModule.forFeature([User, Learning])],
  providers: [LearningService],
  controllers: [LearningController],
  exports: [LearningService],
})
export class LearningModule {}
