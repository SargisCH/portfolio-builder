import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { User } from './user.entity';
import { Project } from './project.entity';

const entities: unknown[] = [User, Session, Project];
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],

            useFactory: async (configService: ConfigService) => {
                const host = configService.get<string>('db.host');
                const port = configService.get<number>('db.port');
                console.log(`[DB CONFIG] Host: ${host}, Port: ${port}`);
                return {
                    type: configService.get<string>('db.type'),
                    host: configService.get<string>('db.host'),
                    port: configService.get<number>('db.port'),
                    database: configService.get<string>('db.name'),
                    username: configService.get<string>('db.user'),
                    password: configService.get<string>('db.password'),
                    synchronize: configService.get<boolean>('db.synchronize'),
                    bigNumberStrings: false,
                    entities: entities,
                    migrations: ['../migrations/**/*.ts'],
                    ssl: false,
                } as TypeOrmModuleOptions;
            },
        }),
    ],

    controllers: [],
    providers: [],
})
export class DatabaseModule {}
