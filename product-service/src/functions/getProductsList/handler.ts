import 'source-map-support/register';

import type { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { dataBase } from '@database/db';

const getProductsList: Handler = async (_event) => {
  if (dataBase) {
    return {
      statusCode: 200,
      body: JSON.stringify(dataBase),
    };
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ statusCode: 404, message: 'Not found' }),
  };
};

export const main = middyfy(getProductsList);
