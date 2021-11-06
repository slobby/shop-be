import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FacadeController } from './facade.controller';

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
  providers: [],
})
export class FacadeModule {}
