// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadProjectScreenshot, UploadProjectFile } from './storage.dto';
import { Storage } from '../../database/entities/models';
import * as sharp from 'sharp';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}

  async uploadProjectScreenshot(
    filepath: string,
    filename: string,
    userId: number,
    body: UploadProjectScreenshot,
  ): Promise<Storage | undefined> {
    const thumbnail = await this.createThumbnail(filepath, filename);
    const file = new Storage();
    file.filepath = filepath;
    file.category = 'Screenshot';
    file.thumbnail = thumbnail;
    file.description = body.description;
    file.project = <any>body.projectId;
    file.user = <any>userId;
    return this.storageRepository.save(file);
  }

  async uploadProjectFile(
    filepath: string,
    userId: number,
    originalFilename: string,
    body: UploadProjectFile,
  ): Promise<Storage | undefined> {
    const file = new Storage();
    file.filepath = filepath;
    file.category = 'File';
    file.description = originalFilename;
    file.project = <any>body.projectId;
    file.user = <any>userId;
    return this.storageRepository.save(file);
  }

  async createThumbnail(
    filepath: string,
    filename: string,
  ): Promise<string | undefined> {
    const thumbnailPath = `/files/thumbnails/${filename}`;
    await sharp(filepath)
      .resize({ width: 250, height: 250 })
      .toFile(thumbnailPath);
    return thumbnailPath;
  }

  async getAllProjectScreenshots(
    usrprojects: number[],
    projectId: number,
  ): Promise<Storage[] | undefined> {
    return this.storageRepository
      .createQueryBuilder('storage')
      .leftJoinAndSelect('storage.user', 'users')
      .where('storage.project = :projectId ', { projectId: projectId })
      .andWhere('storage.project IN (:...userpr)', { userpr: usrprojects })
      .andWhere('storage.category = :cat', { cat: 'Screenshot' })
      .orderBy('storage.createdAt', 'DESC')
      .getMany();
  }

  async getAllProjectFiles(
    usrprojects: number[],
    projectId: number,
  ): Promise<Storage[] | undefined> {
    return this.storageRepository
      .createQueryBuilder('storage')
      .leftJoinAndSelect('storage.user', 'users')
      .where('storage.project = :projectId ', { projectId: projectId })
      .andWhere('storage.project IN (:...userpr)', { userpr: usrprojects })
      .andWhere('storage.category = :cat', { cat: 'File' })
      .orderBy('storage.createdAt', 'DESC')
      .getMany();
  }
}
