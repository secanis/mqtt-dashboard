export interface MqttSys {
    version: string;
    timestamp: Date;
    uptime: string;
    load: {
        messages: MqttSysDataTransfer;
        publish: MqttSysDataTransfer;
        bytes: MqttSysDataTransfer;
        connections: MqttSysDataTransfer;
    };
    messages: MqttSysDataTransferStored;
    store: {
        messages: {
            bytes: number;
            count: number;
        };
    };
    publish: {
        messages: MqttSysDataTransfer;
        bytes: MqttSysDataTransfer;
    };
    bytes: MqttSysDataTransfer;
    subscriptions: {
        count: number;
    };
    'retained messages': {
        count: number;
    };
}

interface MqttSysDataTransfer {
    received: MqttSysDataAvg;
    sent: MqttSysDataAvg;
}

interface MqttSysDataTransferStored extends MqttSysDataTransfer {
    stored: number;
}

interface MqttSysDataAvg {
    '1min': number;
    '5min': number;
    '15min': number;
}
