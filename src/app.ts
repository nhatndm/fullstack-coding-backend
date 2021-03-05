import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

export class App {
  private appIns: Promise<INestApplication>;
  private expressAppIns = express();

  constructor() {
    const adapter = new ExpressAdapter(this.expressAppIns);

    this.appIns = NestFactory.create(AppModule, adapter);

    const config = new DocumentBuilder()
      .setTitle('Blog')
      .setDescription('This is Blog API documentation')
      .setVersion('0.0.1')
      .addBearerAuth()
      .build();

    this.appIns.then(v => {
      const document = SwaggerModule.createDocument(v, config);

      SwaggerModule.setup('api', v, document);
    });
  }

  get app(): Promise<INestApplication> {
    return this.appIns;
  }

  get expressApp(): Express.Application {
    return this.expressAppIns;
  }
}
