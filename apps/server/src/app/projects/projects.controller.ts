import {
    Body,
    Controller,
    Delete,
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
import {
    ProjectCreateDto,
    ProjectResponse,
    ProjectUpdateDto,
} from '../../../../../libs/shared/src/projects';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../storage/storage.service';
import { WinstonLogger } from '@/common';

@Controller('/projects')
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectService,
        private readonly storageService: StorageService,
        private readonly logger: WinstonLogger
    ) {}

    @Get('/')
    async getMany(): Promise<ProjectResponse[]> {
        return this.projectsService.getMany();
    }
    @Get('/:id')
    async getOne(@Param('id', ParseUUIDPipe) id: string): Promise<ProjectResponse> {
        return this.projectsService.getProjectById(id);
    }

    @Post('/:id/upload')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'thumbs' }, { name: 'renders' }]))
    async uploadImages(
        @UploadedFiles() files: { thumbs?: Express.Multer.File[]; renders?: Express.Multer.File[] },
        @Param('id', ParseUUIDPipe) id: string
    ): Promise<{ thumbs: string[]; renders: string[] }> {
        const thumbFiles = (files.thumbs || []).filter((f) => f.size > 0);
        const renderFiles = (files.renders || []).filter((f) => f.size > 0);

        const uploadedThumbs = await this.storageService.uploadMultiple(
            thumbFiles.map((f) => ({
                key: `${id}/thumbs/${f.originalname}`,
                body: f.buffer,
                contentType: f.mimetype || 'application/octet-stream',
            }))
        );
        const uploadedRenders = await this.storageService.uploadMultiple(
            renderFiles.map((f) => ({
                key: `${id}/renders/${f.originalname}`,
                body: f.buffer,
                contentType: f.mimetype || 'application/octet-stream',
            }))
        );

        return { thumbs: uploadedThumbs, renders: uploadedRenders };
    }

    @Put('/:id')
    async updateSelf(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() project: ProjectUpdateDto
    ): Promise<ProjectResponse> {
        return await this.projectsService.updateProject(id, project);
    }

    @Post('/')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'thumbs' }, { name: 'renders' }]))
    async createOne(
        @UploadedFiles() files: { thumbs: Express.Multer.File[]; renders: Express.Multer.File[] },
        @Body() project: ProjectCreateDto
    ): Promise<ProjectResponse> {
        this.logger.info(`thumbnalis ${files.thumbs.length}`);
        const uploadedThumbUrls = await this.storageService.uploadMultiple(
            files.thumbs.map((thumb) => ({
                key: `${project.title}/thumbs/${thumb.originalname}`,
                body: thumb.buffer,
                contentType: 'application/json',
            }))
        );
        this.logger.log(`renders ${files.renders.length}`);
        const uploadedRendersUrl = await this.storageService.uploadMultiple(
            files.renders.map((render) => ({
                key: `${project.title}/renders/${render.originalname}`,
                body: render.buffer,
                contentType: 'application/json',
            }))
        );
        this.logger.info(`uploaded thumbs ${JSON.stringify(uploadedThumbUrls)}`);
        this.logger.info(`uploaded renders ${JSON.stringify(uploadedRendersUrl)}`);
        const projectToCreate = {
            ...project,
            thumbs: uploadedThumbUrls,
            renders: uploadedRendersUrl,
        };
        return await this.projectsService.createOne({ ...projectToCreate });
    }
    @Delete('/:id')
    async deleteOne(@Param('id', ParseUUIDPipe) id: string): Promise<number> {
        return await this.projectsService.deleteOne(id);
    }
}
