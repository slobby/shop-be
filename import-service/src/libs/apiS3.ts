import type { S3Event } from 'aws-lambda';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export type GetImportProductsFileAPIGatewayProxyEvent = Omit<
  APIGatewayProxyEvent,
  'queryStringParameters'
> & { queryStringParameters: { name: string } };