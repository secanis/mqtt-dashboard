import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from 'nestjs-redis';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { MqttGateway } from './gateways/mqtt.gateway';


@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'public'),
        }),
        RedisModule.forRootAsync({
            useFactory: (configService: ConfigService) => configService.get('redis'),
            inject: [ConfigService],
        }),
    ],
    controllers: [AppController],
    providers: [AppService, MqttGateway],
})
export class AppModule {}
