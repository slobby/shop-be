/* eslint-disable consistent-return */
/* eslint-disable no-console */
import 'source-map-support/register';
import { PublishCommand } from '@aws-sdk/client-sns';
import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import type { Handler, SQSEvent } from 'aws-lambda';
import { SuccessJSONResponse, ErrorJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import createFromSNSProductSchema from '@interfaces/createFromSNSProductSchema';
import { CreateProduct } from '@interfaces/CreateProduct';
import { snsClient } from '@libs/snsClient';
import { ProductService } from '@libs/ProductService ';

export const catalogBatchProcess: Handler<SQSEvent> = async (event) => {
  const ajv = new Ajv();
  const validate = ajv.compile(createFromSNSProductSchema);
  const promises = event.Records.map(async (record) => {
    try {
      const rawProduct = <CreateProduct>JSON.parse(record.body);
      if (!validate(rawProduct)) {
        throw new Error(
          `[Error!]: Couldn't convert recieved record to Protuct type - ${record.body}`,
        );
      }
      const result = await ProductService.createProduct(rawProduct);
      console.log(`[Info!]: Insert new Product into base with id - ${result} `);
      const params = {
        Subject: 'Notification',
        Message: `Create new product: ${record.body}`,
        MessageAttributes: {
          quantity: {
            DataType: 'Number',
            StringValue: rawProduct.count.toString(),
          },
        },
        TopicArn: process.env['SNS_ARN'],
      };
      const data = await snsClient.send(new PublishCommand(params));
      console.log('Message sent successfully', data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  try {
    await Promise.all(promises);
    return SuccessJSONResponse(StatusCodes.OK, 'Handled all records');
  } catch (error) {
    return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

export const main = middyfy(catalogBatchProcess);
