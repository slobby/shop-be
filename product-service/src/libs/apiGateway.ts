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

export const SuccessJSONResponse = (
  statusCode: StatusCodes,
  response: Record<string, string>,
) => ({
  statusCode: statusCode || StatusCodes.OK,
  body: JSON.stringify(response),
});

export const ErrorJSONResponse = (statusCode: StatusCodes, error: Error) => ({
  statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  body: JSON.stringify({
    message:
      error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  }),
});
