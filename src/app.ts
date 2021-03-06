import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import * as express from 'express';

export class App {
  private appIns: Promise<INestApplication>;
  private expressAppIns = express();

  constructor() {
    const adapter = new ExpressAdapter(this.expressAppIns);

    this.appIns = NestFactory.create(AppModule, adapter);
  }

  get app(): Promise<INestApplication> {
    return this.appIns;
  }

  get expressApp(): Express.Application {
    return this.expressAppIns;
  }

  async configSwagger(isLambda: boolean): Promise<void> {
    const app = await this.app;
    let swaggerBuild: any;

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Blog')
      .setDescription('This is Blog API documentation')
      .setVersion('0.0.1')
      .addBearerAuth();

    if (isLambda) {
      swaggerBuild = swaggerConfig.addServer('/prod').build();
    } else {
      swaggerBuild = swaggerConfig.build();
    }
    const document = SwaggerModule.createDocument(app, swaggerBuild);

    SwaggerModule.setup('api', app, document);
  }
}
