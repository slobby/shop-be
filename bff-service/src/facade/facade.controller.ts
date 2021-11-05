import {
  Controller,
  All,
  Inject,
  Req,
  Res,
  BadGatewayException,
  HttpStatus,
} from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller()
export class FacadeController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  @All()
  async handler(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    this.logger.info(`Request url - ${request.originalUrl}`);
    const recipient = request.originalUrl.split('/')[1];
    this.logger.info(`Request recipient - ${recipient}`);

    let recipientURL: string = '';
    if (recipient) {
      recipientURL = this.configService.get<string>(recipient);
      this.logger.info(`Founded recipientURL - ${recipientURL}`);
    }
    if (recipientURL) {
      const { method, originalUrl, body } = request;
      const axiosConfig: AxiosRequestConfig = {
        method: <Method>method,
        url: `${recipientURL}${originalUrl}`,
        ...(Object.keys(body).length > 0 && { data: body }),
      };

      this.logger.info(`axios config - ${JSON.stringify(axiosConfig)}`);

      try {
        const recipienResponse = await axios(axiosConfig);
        this.logger.info(
          `Recived response status - ${recipienResponse.status}`,
        );
        this.logger.info(
          `Recived response data - ${JSON.stringify(recipienResponse.data)}`,
        );
        response.status(recipienResponse.status).json(recipienResponse.data);
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          this.logger.error(`Recived error status - ${status}`);
          this.logger.error(`Recived error data - ${JSON.stringify(data)}`);
          response.status(status).json(data);
        } else {
          this.logger.error(
            `Error - ${error.message} while sending request to - ${axiosConfig.url}`,
          );
          response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      }
    } else {
      this.logger.error(
        `Service cannot find recipientURL by the recipient-service-name [${recipient}]`,
      );
      const errorMessage = 'Cannot process request';
      const errorDEscription = `Service cannot find recipientURL by the recipient-service-name [${recipient}]`;
      throw new BadGatewayException(errorMessage, errorDEscription);
    }
  }
}
