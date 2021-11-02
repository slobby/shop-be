import { ConfigService } from '@nestjs/config';
import { IEnvironmentVariables } from './common/interfaces/IEnvironmentVariables';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

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
