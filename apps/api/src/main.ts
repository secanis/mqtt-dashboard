import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

const port = process.env.PORT || 3333

// set env port env-variable for docker healthcheck if not set
if (!process.env.PORT) process.env.PORT = port.toString();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    await app.listen(port, () => {
        Logger.log(
            'Listening at http://localhost:' + port + '/' + globalPrefix
        );
    });
}

bootstrap();
