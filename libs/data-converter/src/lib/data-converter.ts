import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EChartsOption } from 'echarts';
import * as moment from 'moment';

import { MqttSys } from '../../../api-interfaces/src/lib/api-interfaces';

import { ChartData } from './models';

export function getLoadPublishChart(mqttSysInfo: Observable<MqttSys[]>): Observable<EChartsOption> {
    return mqttSysInfo.pipe(
        map(i =>
            i.reduce(
                (acc, sys): ChartData => {
                    return {
                        ts: [...acc.ts, sys.timestamp],
                        data: {
                            received: [...acc.data.received, sys?.load?.publish.received['1min']],
                            sent: [...acc.data.sent, sys?.load?.publish.sent['1min']],
                            subscriptions: [...acc.data.subscriptions, sys?.subscriptions?.count],
                        },
                    };
                },
                {
                    ts: [],
                    data: {
                        received: [],
                        sent: [],
                        subscriptions: [],
                    },
                },
            ),
        ),
        map(generateChartData),
    );
}

export function getLoadMessagesChart(mqttSysInfo: Observable<MqttSys[]>): Observable<EChartsOption> {
    return mqttSysInfo.pipe(
        map(i =>
            i.reduce(
                (acc, sys): ChartData => {
                    return {
                        ts: [...acc.ts, sys.timestamp],
                        data: {
                            received: [...acc.data.received, sys?.load?.messages.received['1min']],
                            sent: [...acc.data.sent, sys?.load?.messages.sent['1min']],
                            stored: [...acc.data.stored, sys?.messages?.stored],
                        },
                    };
                },
                {
                    ts: [],
                    data: {
                        received: [],
                        sent: [],
                        stored: [],
                    },
                },
            ),
        ),
        map(generateChartData),
    );
}

export function getLoadBytesChart(mqttSysInfo: Observable<MqttSys[]>): Observable<EChartsOption> {
    return mqttSysInfo.pipe(
        map(i =>
            i.reduce(
                (acc, sys): ChartData => {
                    return {
                        ts: [...acc.ts, sys.timestamp],
                        data: {
                            received: [...acc.data.received, sys?.load?.bytes.received['1min']],
                            sent: [...acc.data.sent, sys?.load?.bytes.sent['1min']],
                            stored: [...acc.data.stored, sys?.store?.messages.bytes],
                        },
                    };
                },
                {
                    ts: [],
                    data: {
                        received: [],
                        sent: [],
                        stored: [],
                    },
                },
            ),
        ),
        map(generateChartData),
    );
}

export function getConnectionChart(mqttSysInfo: Observable<MqttSys[]>): Observable<EChartsOption> {
    return mqttSysInfo.pipe(
        map(i =>
            i.reduce(
                (acc, sys): ChartData => {
                    return {
                        ts: [...acc.ts, sys.timestamp],
                        data: {
                            connections: [...acc.data.connections, sys?.load?.connections['1min']],
                        },
                    };
                },
                {
                    ts: [],
                    data: {
                        connections: [],
                    },
                },
            ),
        ),
        map(generateChartData),
    );
}

function generateChartData(chartDataList: ChartData): EChartsOption {
    return {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: chartDataList.ts.map(i => formatDate(i)),
        },
        yAxis: {
            type: 'value',
        },
        legend: {
            data: Object.keys(chartDataList.data),
        },
        series: Object.keys(chartDataList.data).map(k => ({
            name: k,
            data: chartDataList.data[k],
            type: 'line',
        })),
    };
}

function formatDate(date: Date): string {
    return moment(date).format('DD.MM.yyyy - HH:mm:ss');
}
