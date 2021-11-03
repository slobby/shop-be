import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IEnvironmentVariables } from './common/interfaces/IEnvironmentVariables';
import { uncaughtExceptionHandler } from './common/helpers/uncaughtException';
import { unhandledRejectionHandler } from './common/helpers/unhandledRejection';

process.on('uncaughtException', uncaughtExceptionHandler);
process.on('unhandledRejection', unhandledRejectionHandler);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService =
    app.get<ConfigService<IEnvironmentVariables>>(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  await app.listen(port, () =>
    process.stdout.write(`Listening on port ${port}`),
  );
}
bootstrap();
