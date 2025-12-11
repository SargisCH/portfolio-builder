import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../db/project.entity';
import { StorageService } from '../storage/storage.service';
import { WinstonLogger } from '@/common';

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    controllers: [ProjectsController],
    providers: [ProjectService, StorageService, WinstonLogger],
    exports: [ProjectService],
})
export class ProjectModule {}
