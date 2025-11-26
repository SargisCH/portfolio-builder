import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '@/app/db/project.entity';
import {
    ProjectCreateDto,
    ProjectCreateType,
    ProjectResponse,
    ProjectUpdateDto,
} from '@workspace/shared';
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

    async updateProject(
        id: string,
        project: Partial<
            Omit<ProjectCreateDto, 'thumbs' | 'renders'> & {
                thumbs: string[];
                renders: string[];
            }
        >
    ): Promise<ProjectResponse> {
        await this.projectRepository.update({ id }, { ...project });
        return Project.findOneBy({ id });
    }

    async getMany(): Promise<ProjectResponse[]> {
        return this.projectRepository.find();
    }
    async createOne(
        project: Omit<ProjectCreateDto, 'thumbs' | 'renders'> & {
            thumbs: string[];
            renders: string[];
        }
    ) {
        const createdProject = this.projectRepository.create(project);
        return createdProject.save();
    }
    async deleteOne(id: string): Promise<number> {
        const query = await Project.delete({ id });

        if (query.affected === 0) throw new NotFoundException();
        return query.affected;
    }
}
