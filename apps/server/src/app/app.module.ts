import { staticDir } from '@/common/filesystem';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { config } from '@/common';
import { DatabaseModule } from './db/database.module';
import { CliModule } from './cli/cli.module';
import { CronModule } from './cron/cron.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './projects/projects.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
            isGlobal: true,
        }),

        ServeStaticModule.forRoot({
            rootPath: staticDir(),
            exclude: ['/api*'],
        }),

        DatabaseModule,
        CliModule,
        CronModule,
        AuthModule,
        UsersModule,
        ProjectModule,
    ],

    controllers: [],
})
export class AppModule {}
