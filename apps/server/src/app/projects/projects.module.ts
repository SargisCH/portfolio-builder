import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../db/project.entity';
import { StorageService } from '../storage/storage.service';

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    controllers: [ProjectsController],
    providers: [ProjectService, StorageService],
    exports: [ProjectService],
})
export class ProjectModule {}
