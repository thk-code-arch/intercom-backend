// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageController } from './storage.controller';
import { User, Storage, Chatroom } from '../../database/entities/models';

@Module({
  imports: [TypeOrmModule.forFeature([User, Storage, Chatroom])],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
