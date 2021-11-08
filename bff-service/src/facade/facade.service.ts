import { Injectable, Inject, CACHE_MANAGER, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { ResponseData } from 'src/common/interfaces/ResponseData';
import { GetDataProperty } from 'src/common/interfaces/getDataProperty';

@Injectable()
export class FacadeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  async getData({
    method,
    recipientURL,
    originalUrl,
    body,
  }: GetDataProperty): Promise<ResponseData> {
    if (method == 'GET') {
      const cached_value = await this.cacheManager.get(originalUrl);
      if (cached_value) {
        this.logger.info(
          `Recived cached data - ${JSON.stringify(cached_value)}`,
        );
        return {
          status: HttpStatus.OK,
          data: cached_value,
        };
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      method: <Method>method,
      url: `${recipientURL}${originalUrl}`,
      ...(Object.keys(body).length > 0 && { data: body }),
    };

    this.logger.info(`axios config - ${JSON.stringify(axiosConfig)}`);

    try {
      const { status, data } = await axios(axiosConfig);
      this.logger.info(`Recived response status - ${status}`);
      this.logger.info(`Recived response data - ${JSON.stringify(data)}`);
      if (method == 'GET') {
        await this.cacheManager.set(originalUrl, data);
      }
      return {
        status,
        data,
      };
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        this.logger.error(`Recived error status - ${status}`);
        this.logger.error(`Recived error data - ${JSON.stringify(data)}`);
        return {
          status,
          data,
        };
      } else {
        this.logger.error(
          `Error - ${error.message} while sending request to - ${axiosConfig.url}`,
        );
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: { error: error.message },
        };
      }
    }
  }
}
