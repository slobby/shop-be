import 'source-map-support/register';

import type { APIGatewayProxyResult, Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { GetProductByIdAPIGatewayProxyEvent } from '@libs/apiGateway';

import { Product } from '../../interfaces/Product';
import { dataBase } from '../../database/db';

export const getProductById: Handler<
  GetProductByIdAPIGatewayProxyEvent<{ productId: string }>,
  APIGatewayProxyResult
> = async (event) => {
  const { productId } = event.pathParameters;
  if (!productId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ statusCode: 400, message: 'Bad request' }),
    };
  }
  const prod: Product | undefined = dataBase.find(
    (item) => item.id === productId,
  );
  if (prod) {
    return {
      statusCode: 200,
      body: JSON.stringify(prod),
    };
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ statusCode: 404, message: 'Not found' }),
  };
};

export const main = middyfy(getProductById);
