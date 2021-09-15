import 'source-map-support/register';
import AWS from 'aws-sdk';
import { StatusCodes } from 'http-status-codes';

import type { GetImportProductsFileAPIGatewayProxyEvent } from '@libs/apiGateway';
import { SuccessJSONResponse, ErrorJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import type { APIGatewayProxyResult, Handler } from 'aws-lambda';

const importProductFile: Handler<
  GetImportProductsFileAPIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (event) => {
  try {
    const { name } = event.queryStringParameters;
    const { CSV_BUCKET, CSV_FOLDER } = process.env;
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    const params = {
      Bucket: CSV_BUCKET,
      Key: `${CSV_FOLDER}/${name}`,
      Expires: 20,
      ContentType: 'text/csv',
    };

    const putSignetURL = await s3.getSignedUrlPromise('putObject', params);

    if (putSignetURL) {
      return SuccessJSONResponse(StatusCodes.OK, putSignetURL);
    }
    throw new Error('Couldn`t create url');
  } catch (error) {
    return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

export const main = middyfy(importProductFile);
