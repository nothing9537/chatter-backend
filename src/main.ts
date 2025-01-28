import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: ['localhost:5173', 'main.d2rmra5jincxb8.amplifyapp.com'],
  });

  const configService = app.get(ConfigService);

  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
