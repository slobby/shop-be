import type { APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export const SuccessJSONResponse = <T>(
  statusCode: StatusCodes,
  response: T,
): APIGatewayProxyResult => ({
  statusCode: statusCode || StatusCodes.OK,
  body: JSON.stringify(response),
});

export const ErrorJSONResponse = (
  statusCode: StatusCodes,
  error: Error,
): APIGatewayProxyResult => ({
  statusCode: statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  body: JSON.stringify({
    message:
      error.message || getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
  }),
});
