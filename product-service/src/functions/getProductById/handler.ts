import 'source-map-support/register';

import type {  Handler } from "aws-lambda"
import { middyfy } from '@libs/lambda';

import  { dataBase } from '@database/db'
import { Product } from '@interfaces/Product';

const getProductById: Handler = async (
  event,
) => {
  const id = event.pathParameters.productId

  const prod: Product | undefined = dataBase.find(item => item.id === id);
  if (prod) {
    return {
      statusCode: 200,
      body: JSON.stringify(prod)
    }
  }
  return {
      statusCode: 404,
      body: JSON.stringify({})
    }  
}

export const main = middyfy(getProductById);
