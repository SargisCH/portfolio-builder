import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule {}
