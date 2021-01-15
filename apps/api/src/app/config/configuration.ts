import { Logger } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs';
import { IClientOptions } from 'mqtt';

interface MqttDashboardConfig {
    redis: {
        host: string;
        port: number;
    },
    mqtt: IClientOptions;
}

let config: MqttDashboardConfig = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    mqtt: {
        host: process.env.MQTT_HOST || 'localhost',
        hostname: process.env.MQTT_HOST || 'localhost',
        port: parseInt(process.env.MQTT_PORT, 10) || 1883,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        protocol: (process.env.PROTOCOL === ('ws' || 'wss' || 'mqtt' || 'mqtts')) ? process.env.PROTOCOL : 'mqtt',
        protocolVersion: parseInt(process.env.MQTT_PROTOCOL_VERSION, 10) || 5,
    },
};

if (process.env.NODE_ENV !== 'production') {
    const localDevConf = `${__dirname}/../../../apps/api/src/app/config/conf_dev.json`;
    if (existsSync(localDevConf)) {
        config = {
            ...JSON.parse(readFileSync(localDevConf).toString()),
        };
    }
}

export default () => ({
    ...config,
    redis: {
        ...config.redis,
        port: parseInt(config.redis.port.toString(), 10),
        onClientReady: client => {
            client.on('connect', () => {
                Logger.log(`connected ✔`, 'Redis');
            });
            client.on('error', err => {
                Logger.log(err, 'Redis');
            });
        },
        connectTimeout: 20000,
    },
    mqtt: {
        ...config.mqtt,
        port: parseInt(config.mqtt.port.toString(), 10),
        protocol: 'ws',
    },
});
