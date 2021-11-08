import {
  Controller,
  All,
  Inject,
  Req,
  Res,
  Param,
  BadGatewayException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Method } from 'axios';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { FacadeService } from './facade.service';

@Controller()
export class FacadeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
    private facadeService: FacadeService,
  ) {}

  @All('/:recipient')
  async handler(
    @Req() request: Request,
    @Param('recipient') recipient: string,
    @Res() response: Response,
  ): Promise<any> {
    const recipientURL = this.configService.get<string>(recipient);

    this.logger.info(`Request url - ${request.originalUrl}`);
    this.logger.info(`Founded recipientURL - ${recipientURL}`);

    if (recipientURL) {
      const { method, originalUrl, body } = request;
      const { status, data } = await this.facadeService.getData({
        method: <Method>method,
        recipientURL,
        originalUrl,
        body,
      });

      response.status(status).json(data);
    } else {
      const errorDescription = `Service cannot find recipientURL by the recipient-service-name [${recipient}]`;
      this.logger.error(errorDescription);
      throw new BadGatewayException('Cannot process request', errorDescription);
    }
  }
}
