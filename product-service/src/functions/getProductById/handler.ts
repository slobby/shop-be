/* eslint-disable no-console */
import 'source-map-support/register';

import type { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { middyfy } from '@libs/lambda';
import {
  GetProductByIdAPIGatewayProxyEvent,
  SuccessJSONResponse,
  ErrorJSONResponse,
} from '@libs/apiGateway';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { connectionOptions } from '@database/config';

// import { Product } from '../../interfaces/Product';

export const getProductById: Handler<
  GetProductByIdAPIGatewayProxyEvent<{ productId: string }>,
  APIGatewayProxyResult
> = async (event) => {
  const { productId } = event.pathParameters;

  if (!productId) {
    return ErrorJSONResponse(
      StatusCodes.BAD_REQUEST,
      new Error(getReasonPhrase(StatusCodes.BAD_REQUEST)),
    );
  }
  console.log('From handler');
  console.log(connectionOptions);

  const client = new Client(connectionOptions);
  try {
    await client.connect();
    const result = await client.query(
      'SELECT p.id, p.title, p.description, p.price, s.count, p.image FROM public.products p INNER JOIN public.stocks s ON p.id = s.product_id WHERE p.id = $1',
      [productId],
    );
    console.log(result.rows);
    if (result && result.rowCount === 1) {
      return SuccessJSONResponse(StatusCodes.OK, result.rows[0]);
    }
    return ErrorJSONResponse(
      StatusCodes.NOT_FOUND,
      new Error(getReasonPhrase(StatusCodes.NOT_FOUND)),
    );
  } catch (error) {
    console.log(error);
    return ErrorJSONResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      new Error(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)),
    );
  } finally {
    await client.end();
  }
};

export const main = middyfy(getProductById);
