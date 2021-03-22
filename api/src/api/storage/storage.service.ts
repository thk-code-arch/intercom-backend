import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Storage } from '../../database/entities/models';
import * as sharp from 'sharp';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}
  private readonly logger = new Logger(StorageService.name);
  async uploadScreenshot() {}

  async createThumbnail(filepath: string, filename: string) {
    const thumbnailPath = `/files/thumbnails/${filename}`;
    await sharp(filepath)
      .resize({ width: 250, height: 250 })
      .toFile(thumbnailPath);
    return thumbnailPath;
  }
}
