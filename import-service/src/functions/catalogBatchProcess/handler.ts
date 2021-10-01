/* eslint-disable consistent-return */
/* eslint-disable no-console */
import 'source-map-support/register';
import { PublishCommand } from '@aws-sdk/client-sns';
import { Client } from 'pg';
import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import type { Handler, SQSEvent } from 'aws-lambda';
import { SuccessJSONResponse, ErrorJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { connectionOptions } from '@database/config';
import createProductSchema from '@interfaces/createProductSchema';
import { CreateProduct } from '@interfaces/CreateProduct';
import { snsClient } from '@libs/snsClient';

export const catalogBatchProcess: Handler<SQSEvent> = async (event) => {
  const ajv = new Ajv();
  const validate = ajv.compile(createProductSchema);
  const promises = event.Records.map(async (record) => {
    const client = new Client(connectionOptions);
    await client.connect();
    try {
      const rawProduct = JSON.parse(record.body);
      if (!validate(rawProduct)) {
        throw new Error(
          `[Error!]: Couldn't convert recieved record to Protuct type - ${record.body}`,
        );
      }
      const { title, description, count, price, image } = <CreateProduct>(
        rawProduct
      );
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
        console.log(
          `[Info!]: Insert new Product into base with id - ${result.rows[0].id} `,
        );
        const params = {
          Subject: 'Notification',
          Message: `Create new product: ${record.body}`,
          MessageAttributes: {
            quantity: {
              DataType: 'Number',
              StringValue: count.toString(),
            },
          },
          TopicArn: process.env['SNS_ARN'],
        };
        const data = await snsClient.send(new PublishCommand(params));
        console.log('Success sent message', data);
        return SuccessJSONResponse(StatusCodes.OK, 'Inserted');
      }
      throw new Error(`[Error!]: Couldn't save Product in database`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.log(error);
      return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
    } finally {
      await client.end();
    }
  });

  await Promise.all(promises);

  return SuccessJSONResponse(StatusCodes.OK, 'Handled all records');
};

export const main = middyfy(catalogBatchProcess);
