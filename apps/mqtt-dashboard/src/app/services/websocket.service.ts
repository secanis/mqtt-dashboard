import { Injectable } from '@angular/core';
import { MqttSys } from '@mqtt-dashboard/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebsocketService {
    socketStatus$ = new Subject<boolean>();
    socketError$ = new Subject<Error>();

    constructor(private socket: Socket) {
        this.getSocketStatus();
    }

    private getSocketStatus() {
        this.socket.on('connect', (_) => {
            this.socketStatus$.next(true);
            this.socketError$.next();
        });
        this.socket.on('disconnect', (_) => this.socketStatus$.next(false));
        this.socket.on('connect_error' || 'error', (err) => this.socketError$.next(err));
    }

    getMqttConnectedStatus(): Observable<boolean> {
        return this.socket.fromEvent('mqttConnected');
    }

    getSysInfo(): Observable<MqttSys[]> {
        return this.socket.fromEvent('sysinfo');
    }
}
