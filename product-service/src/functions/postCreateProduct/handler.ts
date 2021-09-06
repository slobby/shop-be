/* eslint-disable no-console */
import 'source-map-support/register';

import type { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client, types } from 'pg';
import { middyfy } from '@libs/lambda';
import {
  ValidatedCreateProductAPIGatewayProxyEvent,
  SuccessJSONResponse,
  ErrorJSONResponse,
} from '@libs/apiGateway';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { connectionOptions } from '@database/config';
import { Product } from '@interfaces/Product';

export const postCreateProduct: Handler<
  ValidatedCreateProductAPIGatewayProxyEvent<Omit<Product, 'id'>>,
  APIGatewayProxyResult
> = async (event) => {
  const { title, description, count, price, image } = event.body;

  types.setTypeParser(1700, (val) => parseFloat(val));

  const client = new Client(connectionOptions);

  try {
    await client.connect();
    await client.query('BEGIN');

    /* WITH product as (INSERT INTO public.products (id, title, description, price, image)
      VALUES (DEFAULT, $1, $2, $4, $5) RETURNING id)
      INSERT INTO public.stocks (product_id, count) VALUES ((SELECT product.id FROM product), $3)
    */
    const result = await client.query<{ id: string }>(
      `INSERT INTO public.products (id, title, description, price, image)
      VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id`,
      [title, description, price, image],
    );
    if (result.rowCount === 1 && result.rows[0]) {
      await client.query(
        'INSERT INTO public.stocks (product_id, count) VALUES ($1, $2)',
        [result.rows[0].id, count],
      );
      await client.query('COMMIT');
      return SuccessJSONResponse<{ id: string }>(StatusCodes.OK, {
        id: result.rows[0].id,
      });
    }
    return ErrorJSONResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      new Error(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)),
    );
  } catch (error) {
    await client.query('ROLLBACK');
    return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  } finally {
    await client.end();
  }
};

export const main = middyfy(postCreateProduct);
