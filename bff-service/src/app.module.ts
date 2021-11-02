import { Module } from '@nestjs/common';
import { FacadeModule } from './facade/facade.module';

@Module({
  imports: [FacadeModule],
})
export class AppModule {}
