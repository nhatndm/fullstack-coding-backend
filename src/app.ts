import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
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
}
