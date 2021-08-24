import 'source-map-support/register';

import type { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { dataBase } from '@database/db';
import { Product } from '@interfaces/Product';

const getProductById: Handler = async (event) => {
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
