import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageController } from './storage.controller';
import { MulterModule } from '@nestjs/platform-express';
import { User, Storage, Chatroom } from '../../database/entities/models';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Storage, Chatroom]),
    MulterModule.register({
      dest: './files/input',
    }),
  ],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
