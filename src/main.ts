import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  logger.log('Testing Syslog connection');

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
