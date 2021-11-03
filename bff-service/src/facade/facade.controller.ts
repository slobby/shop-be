import {
  Controller,
  All,
  Req,
  Res,
  BadGatewayException,
  HttpStatus,
} from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller()
export class FacadeController {
  constructor(private configService: ConfigService) {}

  @All()
  async handler(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    console.log(`Request url - ${request.originalUrl}`);
    const recipient = request.originalUrl.split('/')[1];
    console.log(`Request recipient- ${recipient}`);

    let recipientURL: string = '';
    if (recipient) {
      recipientURL = this.configService.get<string>(recipient);
      console.log(`Founded recipientURL- ${recipientURL}`);
    }
    if (recipientURL) {
      const { method, originalUrl, body } = request;
      const axiosConfig: AxiosRequestConfig = {
        method: <Method>method,
        url: `${recipientURL}${originalUrl}`,
        ...(Object.keys(body).length > 0 && { data: body }),
      };

      console.log(`Founded recipientURL- ${axiosConfig}`);

      try {
        const recipienResponse = await axios(axiosConfig);
        response.status(recipienResponse.status).json(recipienResponse.data);
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          response.status(status).json(data);
        } else {
          response
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ error: error.message });
        }
      }
    } else {
      // console.log('error_handle');
      const errorMessage = 'Cannot process request';
      const errorDEscription = `Service cannot find recipientURL by the recipient-service-name [${recipient}]`;
      throw new BadGatewayException(errorMessage, errorDEscription);
    }
  }
}
