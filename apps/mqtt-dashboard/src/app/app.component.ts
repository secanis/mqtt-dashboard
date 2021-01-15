import { Component } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import * as moment from 'moment';

import { WebsocketService } from './services/websocket.service';
import { HttpClient } from '@angular/common/http';
import { EChartsOption } from 'echarts';
import {
    getLoadPublishChart,
    getLoadMessagesChart,
    getLoadBytesChart,
    getConnectionChart,
} from '@mqtt-dashboard/data-converter';

@Component({
    selector: 'mqtt-dashboard-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    hash$ = this.http.get('/assets/hash', { responseType: 'text' });
    socketError$ = this.websocketService.socketError$;
    mqttSysInfo$ = this.websocketService.getSysInfo().pipe(filter(i => i && i.length > 0));
    socketStatus$ = this.websocketService.socketStatus$.pipe(
        map(s => (s ? { icon: 'leak_add', color: 'success' } : { icon: 'leak_remove', color: 'error' })),
    );
    connectedToMqtt$ = combineLatest([this.websocketService.getMqttConnectedStatus(), this.socketStatus$]).pipe(
        map(([ws, s]) => (ws && s.color === 'success' ? 'success' : 'error')),
    );

    mqttSysInfoLatest$ = this.mqttSysInfo$.pipe(
        map(i => ({
            ...i[0],
            uptime: calcUptime(i[0].uptime),
        })),
    );

    // generate chart data and publish it to observable
    loadPublishChart$: Observable<EChartsOption> = getLoadPublishChart(this.mqttSysInfo$);
    loadMessagesChart$: Observable<EChartsOption> = getLoadMessagesChart(this.mqttSysInfo$);
    loadBytesChart$: Observable<EChartsOption> = getLoadBytesChart(this.mqttSysInfo$);
    connectionsChart$: Observable<EChartsOption> = getConnectionChart(this.mqttSysInfo$);

    constructor(private readonly http: HttpClient, private readonly websocketService: WebsocketService) {}
}

function calcUptime(secondsString: string): string {
    const time = (secondsString) ? secondsString.replace('seconds', '').trim() : '';
    const seconds: number = parseInt(time, 10);
    return moment.duration(seconds, 's').humanize();
}
