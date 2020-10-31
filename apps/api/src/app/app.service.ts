import { Injectable } from '@nestjs/common';
import { Message } from '@mqtt-dashboard/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}
