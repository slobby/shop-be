import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { errorLoggerOptions } from '../config/config';

@Module({
  imports: [WinstonModule.forRoot(errorLoggerOptions)],
})
export class LoggerModule {}
