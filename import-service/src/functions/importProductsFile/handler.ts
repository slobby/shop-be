import 'source-map-support/register';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { middyfy } from '@libs/lambda';

import { StatusCodes } from 'http-status-codes';
import type { GetImportProductsFileAPIGatewayProxyEvent } from '@libs/apiGateway';
import { SuccessJSONResponse, ErrorJSONResponse } from '@libs/apiGateway';
import type { APIGatewayProxyResult, Handler } from 'aws-lambda';

const importProductFile: Handler<
  GetImportProductsFileAPIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    const { CSV_BUCKET, CSV_INPUT_FOLDER } = process.env;
    const clientParams = { region: 'eu-west-1' };
    const putObjectParams = {
      Bucket: CSV_BUCKET,
      Key: `${CSV_INPUT_FOLDER}/${name}`,
      ContentType: 'text/csv',
    };

    const client = new S3Client(clientParams);
    const command = new PutObjectCommand(putObjectParams);

    const putSignetURL = await getSignedUrl(client, command, { expiresIn: 60 });

    if (putSignetURL) {
      return SuccessJSONResponse(StatusCodes.OK, putSignetURL);
    }
    throw new Error('Couldn`t create url');
  } catch (error) {
    return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

export const main = middyfy(importProductFile);
