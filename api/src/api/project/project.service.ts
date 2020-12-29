import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, Project } from '../../database/entities/models';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,
  ) {}
  private readonly logger = new Logger(ProjectService.name);

  async get_projects1(usrid: number) {
    return this.usersRepository.findOne({
      where: { id: usrid },
      relations: ['project'],
    });
  }
  async get_projects(usrid: number) {
    const res = await this.usersRepository
      .createQueryBuilder('user')
      .relation('projects')
      .of(usrid)
      .loadMany<Project>();
    console.log(res);
    return res;
  }
  async newProject(usrid: number) {
    const newProj = new Project();
    newProj.name = 'test3';
    newProj.description = 'test22';
    newProj.owner = usrid;
    newProj.parentProject = 2;

    const res = await this.projectsRepository.save(newProj);

    return await this.usersRepository
      .createQueryBuilder('user')
      .relation(User, 'projects')
      .of(usrid)
      .add(res);
  }
}
