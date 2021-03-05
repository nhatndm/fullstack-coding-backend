// APP
import { App } from './app';

async function bootstrap() {
  const mainApp = new App();

  const app = await mainApp.app;

  app.enableCors();

  await app.listen(process.env.PORT);
}

bootstrap();
