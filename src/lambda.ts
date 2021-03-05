import { APIGatewayProxyHandler } from 'aws-lambda';
import { Server } from 'http';
import * as awsServerlessExpress from 'aws-serverless-express';

// APP
import { App } from './app';

let cachedServer: Server;

const bootstrapServer = async (): Promise<Server> => {
  const mainApp = new App();

  const app = await mainApp.app;

  const expressApp = mainApp.expressApp;

  app.enableCors();

  await app.init();

  return awsServerlessExpress.createServer(expressApp);
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }

  return awsServerlessExpress.proxy(cachedServer, event, context, 'PROMISE')
    .promise;
};
