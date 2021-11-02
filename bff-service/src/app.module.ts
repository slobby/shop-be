import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FacadeModule } from './facade/facade.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FacadeModule,
  ],
})
export class AppModule {}
