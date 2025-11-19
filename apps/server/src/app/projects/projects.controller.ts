import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './projects.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../db/user.entity';
import { ProjectCreateDto, ProjectResponse } from '../../../../../libs/shared/src/projects';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';

@Controller('/projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectService,
        private readonly storageService: StorageService
    ) {}

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
    @UseInterceptors(FileFieldsInterceptor([{ name: 'thumbs' }, { name: 'renders' }]))
    async createOne(
        @UploadedFiles() files: { thumbs: Express.Multer.File[]; renders: Express.Multer.File[] },
        @Body() project: ProjectCreateDto
    ): Promise<ProjectResponse> {
        const uploadedThumbUrls = await this.storageService.uploadMultiple(
            files.thumbs.map((thumb) => ({
                key: thumb.originalname,
                body: thumb.buffer,
                contentType: 'application/json',
            }))
        );
        const uploadedRendersUrl = await this.storageService.uploadMultiple(
            files.renders.map((render) => ({
                key: render.originalname,
                body: render.buffer,
                contentType: 'application/json',
            }))
        );
        const projectToCreate = {
            ...project,
            thumbs: uploadedThumbUrls,
            renders: uploadedRendersUrl,
        };
        return await this.projectsService.createOne({ ...projectToCreate });
    }
}
