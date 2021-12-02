import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RedisIoAdapter } from './adapter/redis-io.adapter';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger:
    //   process.env.NODE_ENV !== 'production'
    //     ? ['log', 'debug', 'error', 'verbose', 'warn']
    //     : ['error', 'warn'],
  });
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
  // app.useGlobalFilters(new HttpExceptionFilter());
  const server = await app.listen(3000, () =>
    logger.log(`Application listening on port 3000`),
  );
  server.keepAliveTimeout = 70000;
  //Connecting to AWS through SDK
  config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
}
bootstrap();
