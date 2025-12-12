import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './global-exception-filters/global-exception.filter';
import { TypeOrmExceptionFilter } from './global-exception-filters/typeorm-exception-filter';
import { ValidationPipe } from '@nestjs/common';
// import * as fs from 'fs';

async function bootstrap() {
    // For server
    // const httpsOptions = {
    //     key: fs.readFileSync(__dirname + '/../src/config/ssl-key/key.pem', 'utf8'),
    //     cert: fs.readFileSync(__dirname + '/../src/config/ssl-key/server.crt', 'utf8'),
	// 	rejectUnauthorized: false,
    // }

    const app = await NestFactory.create(AppModule); //, {httpsOptions});

    // CORS
    app.enableCors();

    // pipes
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // exception filters
    const configService = app.get(ConfigService);

    // const httpAdapterHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(
        new GlobalExceptionFilter(configService),
        new TypeOrmExceptionFilter(),
    );

    // listen port
    const port = configService.get<string>('APP_PORT');
    await app.listen(port);
}

bootstrap();

