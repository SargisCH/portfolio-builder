import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

const getS3Client = (endpoint: string, accessToken: string, secretAccessKey: string) => {
    return new S3Client({
        region: 'auto',
        endpoint: endpoint,
        credentials: {
            accessKeyId: accessToken,
            secretAccessKey: secretAccessKey,
        },
    });
};

@Injectable()
export class StorageService {
    constructor(private readonly configService: ConfigService) {}

    async uploadFile(key: string, body: Buffer, contentType: string): Promise<string> {
        const s3Client = getS3Client(
            this.configService.get<string>('cloud.storageEndpoint') || '',
            this.configService.get<string>('cloud.accessToken') || '',
            this.configService.get<string>('cloud.secretAccessKey') || ''
        );
        const command = new PutObjectCommand({
            Bucket: this.configService.get('cloud.bucketName'),
            Key: key,
            Body: body,
            ContentType: contentType,
        });
        await s3Client.send(command);
        return this.configService.get('cloud.bucketPublicUrl') + `/${key}`;
    }
    async uploadMultiple(files: { key: string; body: Buffer; contentType: string }[]) {
        return Promise.all(
            files.map((file) => this.uploadFile(file.key, file.body, file.contentType))
        );
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.configService.get('cloud.bucketName'),
            Key: key,
        });
        const s3Client = getS3Client(
            this.configService.get<string>('cloud.storageEndpoint') || '',
            this.configService.get<string>('cloud.accessToken') || '',
            this.configService.get<string>('cloud.secretAccessKey') || ''
        );
        await s3Client.send(command);
    }
}
