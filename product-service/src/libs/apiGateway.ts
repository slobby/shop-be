/* eslint-disable no-console */
import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

import { StatusCodes, getReasonPhrase } from 'http-status-codes';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

export type GetProductByIdAPIGatewayProxyEvent<T = null> = Omit<
  APIGatewayProxyEvent,
  'pathParameters'
> & { pathParameters: T };

export const SuccessJSONResponse = <T>(
  statusCode: StatusCodes,
  response: T,
): APIGatewayProxyResult => {
  console.log(response);
  return {
    statusCode: statusCode || StatusCodes.OK,
    body: JSON.stringify(response),
  };
};

export const ErrorJSONResponse = (
  statusCode: StatusCodes,
  error: Error,
): APIGatewayProxyResult => {
  console.log(error);
  return {
    statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    body: JSON.stringify({
      message:
        error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    }),
  };
};
