import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewProject } from './project.dto';
import {
  User,
  Project,
  Chatroom,
  Projectfile,
} from '../../database/entities/models';

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

  async get_projects(usrid: number) {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .relation('projects')
      .of(usrid)
      .loadMany<Project>();
    return res;
  }
  async select_project(usrprojects: number[], sP: number) {
    const res = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId ', { projectId: sP })
      .andWhere('project.id IN (:...userpr)', { userpr: usrprojects })
      .getOneOrFail();
    return res;
  }
  async getProjectinfo(usrprojects: number[], sP: number) {
    const res = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId ', { projectId: sP })
      .andWhere('project.id IN (:...userpr)', { userpr: usrprojects })
      .getOneOrFail();
    return res;
  }
  async newProject(usrid: number, newProj: NewProject) {
    newProj.owner = usrid;
    const resP = await this.projectsRepository.save(newProj);

    const newroom = new Chatroom();
    newroom.name = newProj.name;
    newroom.project = resP;
    newroom.roomtype = 'PROJECT';
    newroom.description = 'Project Room';
    const resC = await this.chatroomRepository.save(newroom);

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

    this.logger.debug(`new Projects ${PJ} new Chatroom ${CJ}  `);

    return resP;
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
    file.filename = filename.replace('.ifc', '.gltf');
    file.path = path;
    file.project = <any>projectid;
    file.user = <any>userid;
    return this.fileRepository.save(file);
  }
}
