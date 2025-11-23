import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Project } from './app/db/project.entity';
import { User } from './app/db/user.entity';
import { Session } from './app/db/session.entity';
import { Migrations1763890156344 } from './app/migrations/1763890156344-migrations';
config();

const configService = new ConfigService();
console.log(
    "configService.get<string>('DATABASE_HOST')",
    configService.get<string>('DATABASE_HOST'),
    configService.get<string>('DATABASE_NAME'),
    configService.get<string>('DATABASE_PASSWORD'),
    configService.get<string>('DATABASE_USER')
);
export default new DataSource({
    type: 'postgres',
    host: configService.get<string>('DATABASE_HOST'),
    port: 5432,
    username: configService.get<string>('DATABASE_USER'),
    password: configService.get<string>('DATABASE_PASSWORD'),
    database: configService.get<string>('DATABASE_NAME'),
    entities: [User, Project, Session],
    migrations: [Migrations1763890156344],
    ssl: false,
});
