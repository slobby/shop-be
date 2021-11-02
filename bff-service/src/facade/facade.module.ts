import { Module } from '@nestjs/common';
import { AppController } from './facade.controller';
import { AppService } from './facade.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class FacadeModule {}
