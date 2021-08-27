import 'source-map-support/register';

import type { Handler } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

import { dataBase } from '../../database/db';

export const getProductsList: Handler = async (_event) => {
  if (dataBase) {
    return {
      statusCode: 200,
      body: JSON.stringify(dataBase),
    };
  }
  return {
    statusCode: 500,
    body: JSON.stringify({ statusCode: 500, message: 'Server error' }),
  };
};

export const main = middyfy(getProductsList);
