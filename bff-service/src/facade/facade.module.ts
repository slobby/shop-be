import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FacadeController } from './facade.controller';
import { FacadeService } from './facade.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL') || 5,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [FacadeController],
  providers: [FacadeService],
})
export class FacadeModule {}
