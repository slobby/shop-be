/* eslint-disable no-console */
import 'source-map-support/register';

import type { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { Client } from 'pg';
import { middyfy } from '@libs/lambda';
import {
  SuccessJSONResponse,
  ErrorJSONResponse,
  CreateProductAPIGatewayProxyEvent,
} from '@libs/apiGateway';
import { StatusCodes } from 'http-status-codes';
import { connectionOptions } from '@database/config';
import { Product } from '@interfaces/Product';

export const postCreateProduct: Handler<
  CreateProductAPIGatewayProxyEvent<Omit<Product, 'id'>>,
  APIGatewayProxyResult
> = async (event) => {
  const { title, description, count, price, image } = event.body;

  const client = new Client(connectionOptions);

  try {
    await client.connect();
    await client.query('BEGIN');

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
      return SuccessJSONResponse<{ id: string }>(StatusCodes.CREATED, {
        id: result.rows[0].id,
      });
    }
    throw new Error();
  } catch (error) {
    await client.query('ROLLBACK');
    return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  } finally {
    await client.end();
  }
};

export const main = middyfy(postCreateProduct);
