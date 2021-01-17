import { Injectable } from '@nestjs/common';
import { connect, IClientOptions, MqttClient } from 'mqtt';

import { MqttSys } from '@mqtt-dashboard/api-interfaces';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import { RedisService } from 'nestjs-redis';
import { ConfigService } from '@nestjs/config';

const MAX_ITEMS_STORED = 600;
const MQTT_CONNECTIVITY_INTERVAL = 10000;
const MQTT_STORE_INFO_INTERVAL = 30000;

@Injectable()
export class AppService {
    private client: MqttClient;
    private redis = this.redisService.getClient();

    private brokerInfo: any = {};

    private mqtt_SYS = new BehaviorSubject({});
    private mqtt_connected = new BehaviorSubject<boolean>(false);

    constructor(private readonly configService: ConfigService, private readonly redisService: RedisService) {
        const mqttOpts: IClientOptions = this.configService.get('mqtt');

        this.client = connect(mqttOpts);

        this.client.on('connect', obj => {
            this.mqtt_connected.next(true);
            Logger.log(`${obj.cmd} ✔`, 'MQTT');
        });
        this.client.subscribe(['$SYS/#']);

        this.client.on('error', err => Logger.error(err.message, err.stack, 'MQTT'));

        this.client.on('message', (t, b) => {
            this.brokerInfo = {
                ...createPath(this.brokerInfo, t.replace('$SYS/broker/', ''), b.toString()),
                timestamp: new Date(),
            };
        });

        interval(MQTT_CONNECTIVITY_INTERVAL).subscribe(_ => {
            this.mqtt_connected.next(this.client.connected);
        });

        interval(MQTT_STORE_INFO_INTERVAL).subscribe(_ => {
            this.writeDataToRedis('broker', this.brokerInfo);
            this.readRedisData('broker');
        });
    }

    getSysData(): Observable<WsResponse<MqttSys>> {
        return this.mqtt_SYS.asObservable().pipe(map(status => ({ event: 'sysinfo', data: status as MqttSys })));
    }

    getConnectedState(): Observable<WsResponse<boolean>> {
        return this.mqtt_connected.asObservable().pipe(map(status => ({ event: 'mqttConnected', data: status })));
    }

    private async writeDataToRedis(key: string, data: any) {
        await this.redis.lpush(key, JSON.stringify(data));
        await this.redis.ltrim(key, 0, MAX_ITEMS_STORED);
    }

    private async readRedisData(key: string) {
        let data = await this.redis.lrange(key, 0, MAX_ITEMS_STORED);
        data = data.reverse();
        this.mqtt_SYS.next(data.map(i => JSON.parse(i)));
    }
}

const createPath = (obj, path, value = null) => {
    path = typeof path === 'string' ? path.split('/') : path;
    let current = obj;
    while (path.length > 1) {
        const [head, ...tail] = path;
        path = tail;
        if (current[head] === undefined) {
            current[head] = {};
        }
        current = current[head];
    }
    current[path[0]] = value;
    return obj;
};
