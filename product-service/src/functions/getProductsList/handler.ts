import 'source-map-support/register';

import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import { Client, types } from 'pg';
import { middyfy } from '@libs/lambda';
import { connectionOptions } from '@database/config';
import { Product } from '@interfaces/Product';
import { SuccessJSONResponse, ErrorJSONResponse } from '@libs/apiGateway';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export const getProductsList: Handler<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> = async (_event) => {
  types.setTypeParser(1700, (val) => parseFloat(val));

  const client = new Client(connectionOptions);

  try {
    await client.connect();
    const result = await client.query<Product>(
      'SELECT p.id, p.title, p.description, p.price, s.count, p.image FROM public.products p INNER JOIN public.stocks s ON p.id = s.product_id',
      [],
    );

    if (result.rows) {
      return SuccessJSONResponse<Array<Product>>(StatusCodes.OK, result.rows);
    }
    return ErrorJSONResponse(
      StatusCodes.NOT_FOUND,
      new Error(getReasonPhrase(StatusCodes.NOT_FOUND)),
    );
  } catch (error) {
    return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  } finally {
    await client.end();
  }
};

export const main = middyfy(getProductsList);
