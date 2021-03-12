import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarController } from './avatar.controller';
import { Avatarfile } from '../../database/entities/models';

@Module({
  imports: [TypeOrmModule.forFeature([Avatarfile])],
  providers: [AvatarService],
  controllers: [AvatarController],
  exports: [AvatarService],
})
export class AvatarModule {}
