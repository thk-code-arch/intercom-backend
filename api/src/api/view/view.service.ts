// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { View } from '../../database/entities/models';
import { SelectProject, SelectedSubprojects } from './view.dto';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
  ) {}

  async setSelectedSubprojects(
    selSubProj: SelectedSubprojects,
    userId: number,
  ): Promise<View | undefined> {
    const setting = new View();
    setting.project = <any>selSubProj.projectId;
    setting.user = <any>userId;
    setting.selectedSubprojects = <any>selSubProj.selectedSubprojects;
    return this.viewRepository.save(setting);
  }

  async getSelectedSubprojects(
    usrprojects: number[],
    projectId: SelectProject,
  ): Promise<View | undefined> {
    return this.viewRepository
      .createQueryBuilder('view')
      .where('view.project = :projectId ', { projectId: projectId.projectId })
      .andWhere('view.project IN (:...userpr)', { userpr: usrprojects })
      .orderBy('view.createdAt', 'DESC')
      .getOne();
  }
}
