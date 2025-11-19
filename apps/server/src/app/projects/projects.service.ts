import { Injectable } from '@nestjs/common';
import { Project } from '@/app/db/project.entity';
import { ProjectCreateDto, ProjectCreateType, ProjectResponse } from '@workspace/shared';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>
    ) {}

    async getProjectById(id: string): Promise<ProjectResponse> {
        const project = await Project.findOneBy({ id });
        return project;
    }

    async updateProject(id: string, project: ProjectCreateDto): Promise<ProjectResponse> {
        // await this.projectRepository.update({ id }, { ...project });
        return this.projectRepository.findOneBy({ id });
    }

    async getMany(): Promise<ProjectResponse[]> {
        console.log('get many');
        return this.projectRepository.find();
    }
    async createOne(
        project: Omit<ProjectCreateDto, 'thumbs' | 'renders'> & {
            thumbs: string[];
            renders: string[];
        }
    ) {
        const createdProject = await this.projectRepository.create(project);
        return createdProject.save();
    }
}
