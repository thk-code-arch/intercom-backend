import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../database/entities/project.entity';
import { User } from '../../database/entities/user.entity';

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
  async addProject(usrid: number) {
    const newProj = new Project();
    newProj.name = 'test';
    newProj.description = 'test2';
    newProj.owner = 2;
    newProj.parentProject = 2;
    const res = await this.projectsRepository.save(newProj);
    const res2 = await this.usersRepository
      .createQueryBuilder('user')
      .relation(User, 'projects')
      .of(usrid) // you can use just post id as well
      .add(res); // you can use just category id as well
    console.log(res, res2);
    return res;
  }
}
