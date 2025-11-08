import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../db/user.entity';
import { ProjectCreateDto, ProjectResponse } from '../../../../../libs/shared/src/projects';

@Controller('/projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectService) {}

    @Get('/')
    async getMany(): Promise<ProjectResponse[]> {
        return this.projectsService.getMany();
    }
    @Get('/:id')
    async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectResponse> {
        return this.projectsService.getProjectById(id);
    }

    @Put('/:id')
    async updateSelf(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() project: ProjectCreateDto
    ): Promise<ProjectResponse> {
        return await this.projectsService.updateProject(id, project);
    }

    @Post('/')
    async createOne(@Body() project: ProjectCreateDto): Promise<ProjectResponse> {
        return await this.projectsService.createOne(project);
    }
}
