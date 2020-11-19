import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { merge } from 'rxjs';
import { AppService } from '../app.service';
import { Server, Client } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class MqttGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private appService: AppService) {}

    async handleConnection(client: Client, ...args: any[]) {
        Logger.log('connected', client.id);

        merge(this.appService.getConnectedState(), this.appService.getSysData()).subscribe(obj => {
            this.server.emit(obj.event, obj.data);
        });
    }

    async handleDisconnect(client: Client) {
        Logger.log('disconnected', client.id);
    }
}
