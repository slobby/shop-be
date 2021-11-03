import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { errorLoggerOptions } from './common/config/config';
import { FacadeModule } from './facade/facade.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot(errorLoggerOptions),
    FacadeModule,
  ],
})
export class AppModule {}
