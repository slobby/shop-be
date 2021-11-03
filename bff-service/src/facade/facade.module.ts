import { Module } from '@nestjs/common';
import { FacadeController } from './facade.controller';

@Module({
  imports: [],
  controllers: [FacadeController],
  providers: [],
})
export class FacadeModule {}
