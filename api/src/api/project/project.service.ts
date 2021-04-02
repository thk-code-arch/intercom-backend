import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewProject, UpdateProject } from './project.dto';
import {
  User,
  Project,
  Chatroom,
  Projectfile,
} from '../../database/entities/models';
import _ = require('lodash');

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
    @InjectRepository(Chatroom)
    private readonly chatroomRepository: Repository<Chatroom>,
    @InjectRepository(Projectfile)
    private readonly fileRepository: Repository<Projectfile>,
  ) {}
  private readonly logger = new Logger(ProjectService.name);

  async get_projects_and_subprojects(usrid: number) {
    const allprojects = await this.usersRepository
      .createQueryBuilder('user')
      .relation('projects')
      .of(usrid)
      .loadMany<Project>();

    const projects = allprojects.filter((p) => p.parentProject === null);
    const parentprojects = _.map(projects, 'id');

    const subprojects = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.parentProject IN (:...parenProjs)', {
        parenProjs: parentprojects,
      })
      .getMany();

    for (let i = 0; i < projects.length; i++) {
      const found = subprojects.filter(
        (sp) => sp['parentProject'] === projects[i].id,
      );
      if (found) {
        projects[i]['sub'] = found;
      }
    }
    //TODO CLEANUP

    return [...projects, ...subprojects];
  }

  async select_project(
    usrprojects: number[],
    sP: number,
  ): Promise<Project | undefined> {
    return this.projectsRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId ', { projectId: sP })
      .andWhere('project.id IN (:...userpr)', { userpr: usrprojects })
      .getOneOrFail();
  }

  async getProjectinfo(
    usrprojects: number[],
    sP: number,
  ): Promise<Project | undefined> {
    return await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId ', { projectId: sP })
      .andWhere('project.id IN (:...userpr)', { userpr: usrprojects })
      .getOneOrFail();
  }

  async newProject(
    usrid: number,
    newProj: NewProject,
  ): Promise<Project | undefined> {
    newProj.owner = usrid;
    const resP = await this.projectsRepository.save(newProj);

    const newroom = new Chatroom();
    newroom.name = newProj.name;
    newroom.project = resP;
    newroom.roomtype = 'PROJECT';
    if (newProj.parentProject) {
      newroom.roomtype = 'SUBPROJECT';
    }
    newroom.description = 'Project Room';
    const resC = await this.chatroomRepository.save(newroom);
    this.logger.debug(`newChatroom ${resC}  `);

    //Dont create relations when its a subproject
    if (!newProj.parentProject) {
      const PJ = await this.usersRepository
        .createQueryBuilder('user')
        .relation(User, 'projects')
        .of(usrid)
        .add(resP);
      const CJ = await this.usersRepository
        .createQueryBuilder('user')
        .relation(User, 'chatrooms')
        .of(usrid)
        .add(resC);
      this.logger.debug(`new relation Projects ${PJ} new Chatroom ${CJ}  `);
    }

    return resP;
  }

  async updateProject(
    usrid: number,
    updateProject: UpdateProject,
  ): Promise<Project | undefined> {
    const getProject = await this.projectsRepository.findOne({
      where: { id: updateProject.id, owner: usrid },
    });
    getProject.name = updateProject.name;
    getProject.description = updateProject.description;
    const UP = await this.projectsRepository.save(getProject);
    const getChatroom = await this.chatroomRepository.findOne({
      where: { project: getProject },
    });
    getChatroom.name = UP.name;
    const UC = await this.chatroomRepository.save(getChatroom);
    this.logger.debug(`new Projectinfo ${UP} new Chatroom name ${UC}  `);
    return UP;
  }

  async getProjectfile(
    usrprojects: number[],
    sP: number,
  ): Promise<Projectfile | undefined> {
    return await this.fileRepository
      .createQueryBuilder('projectfile')
      .where('projectfile.project = :projectId ', { projectId: sP })
      .andWhere('projectfile.project IN (:...userpr)', { userpr: usrprojects })
      .orderBy('projectfile.createdAt', 'DESC')
      .getOneOrFail();
  }

  async uploadIFC(
    path: string,
    filename: string,
    userid: number,
    projectid: number,
  ): Promise<Projectfile | undefined> {
    const file = new Projectfile();
    file.filename = filename.replace('.ifc', '.glb');
    file.path = path;
    file.project = <any>projectid;
    file.user = <any>userid;
    return this.fileRepository.save(file);
  }
}
