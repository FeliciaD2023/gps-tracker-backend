import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './config/db.config';
// import { ChatGateway } from './chat/chat.gateway';
import { TrackerModule } from './gps-tracker/tracker.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/utils/jwtAuth.guard';
import { JwtStrategy } from './auth/utils/jwt.strategy';
import { JwtLocalStrategy } from './auth/utils/local_auth/jwtLocal.strategy';
import { DeviceModule } from './device/device.module';

@Module({
    imports: [
        // The forRoot() method registers the ConfigService provider, which provides a get() method for reading these parsed/merged configuration variables. 
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
            load: [dbConfig],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                ...(await configService.get('tracker_database'))
            }),
            inject: [ConfigService], 
            // the inject property here indicates that an INSTANCE of the specified dependency should be created and injected into the useFactory function.(here is the configService)
        }),

        // TypeOrmModule.forRoot({
        //     type: 'postgres',
        //     host: 'gps-tracker-demo.cckn0wbphxgb.ap-southeast-2.rds.amazonaws.com',
        //     port: 5432,
        //     database: 'gpsTracker',
        //     username: 'gpsTrackerAdmin',
        //     password: 'cECr$pRUg1Rot7M2DRE3',
        //     autoLoadEntities: true,
        //     synchronize: true,
        //     ssl: {
        //         rejectUnauthorized: false
        //     }

        // }),

        TrackerModule,
        DeviceModule,
        AuthModule,
        // TypeOrmModule.forRoot(configService.getTypeOrmConfig()),

    ],
    controllers: [AppController],
    providers: [
        AppService,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        JwtLocalStrategy,
    ],
})
export class AppModule { }
