// Copyright (c) 2021 Steffen Stein <mail@steffenstein.com> For LICENSE see docs/LICENSE

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { View } from '../../database/entities/models';
import { SelectProject, SelectedSubprojects } from './view.dto';
import { ViewportGateway } from '../../io/viewport.gateway';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    private viewGW: ViewportGateway,
  ) {}

  async setSelectedSubprojects(
    selSubProj: SelectedSubprojects,
    userId: number,
  ): Promise<View | undefined> {
    const setting = new View();
    setting.project = <any>selSubProj.projectId;
    setting.user = <any>userId;
    setting.selectedSubprojects = <any>selSubProj.selectedSubprojects;
    await this.viewGW.sendInViewport(
      JSON.stringify(selSubProj.selectedSubprojects),
      'updateSelectedSubprojects',
      selSubProj.projectId,
    );
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

  async getManySelectedSubprojects(
    usrprojects: number[],
    projectId: SelectProject,
  ): Promise<View[] | undefined> {
    return this.viewRepository
      .createQueryBuilder('view')
      .where('view.project = :projectId ', { projectId: projectId.projectId })
      .andWhere('view.project IN (:...userpr)', { userpr: usrprojects })
      .orderBy('view.createdAt', 'DESC')
      .getMany();
  }
}
