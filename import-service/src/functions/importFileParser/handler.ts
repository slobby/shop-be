/* eslint-disable no-console */
import 'source-map-support/register';
import csv from 'csv-parser';
import Ajv from 'ajv';
import { StatusCodes } from 'http-status-codes';
import type { Handler, S3Event } from 'aws-lambda';
import {
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { SuccessJSONResponse, ErrorJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { s3Client } from '@libs/s3Client';
import { sqsClient } from '@libs/sqsClient';
import createRawProductSchema from '@interfaces/createRawProductSchema';

declare const process: {
  env: {
    CSV_BUCKET: string;
    CSV_INPUT_FOLDER: string;
    CSV_OUTPUT_FOLDER: string;
    SQS_PARCE_URL: string;
  };
};

export const importFileParser: Handler<S3Event> = async (event) => {
  try {
    const ajv = new Ajv();
    const { CSV_BUCKET, CSV_INPUT_FOLDER, CSV_OUTPUT_FOLDER, SQS_PARCE_URL } =
      process.env;

    const promises = event.Records.map(async (record) => {
      const sourcePathFile = `${CSV_BUCKET}/${record.s3.object.key}`;
      const destinationFile = record.s3.object.key.replace(
        CSV_INPUT_FOLDER,
        CSV_OUTPUT_FOLDER,
      );

      const getObjectParams = {
        Bucket: CSV_BUCKET,
        Key: `${record.s3.object.key}`,
      };
      const getCommand = new GetObjectCommand(getObjectParams);
      const getObject = await s3Client.send(getCommand);

      getObject?.Body.pipe(csv())
        .on('data', async (chunk) => {
          console.log(`[Info!]: Received - ${JSON.stringify(chunk)}.`);
          const validate = ajv.compile(createRawProductSchema);
          if (validate(chunk)) {
            const count = Number.parseInt(chunk.count, 10);
            const price = Number.parseFloat(chunk.price);
            if (!Number.isNaN(count) && !Number.isNaN(price)) {
              const SendMessageParams = {
                QueueUrl: SQS_PARCE_URL,
                MessageBody: JSON.stringify({ ...chunk, count, price }),
              };
              const command = new SendMessageCommand(SendMessageParams);
              await sqsClient.send(command);
            } else {
              console.error(
                `[Error!]: Couldn't convert recieved record to Protuct type - ${chunk.toString()}`,
              );
            }
          } else {
            console.error(
              `[Error!]: Recieved record is not valid to Protuct type - ${chunk.toString()}`,
            );
          }
        })
        .on('error', (error) => {
          console.error(error);
        })
        .on('end', async () => {
          const copyObjectParams = {
            Bucket: CSV_BUCKET,
            ContentType: 'text/csv',
            CopySource: sourcePathFile,
            Key: destinationFile,
          };
          const copyCommand = new CopyObjectCommand(copyObjectParams);
          await s3Client.send(copyCommand);
          console.log(
            `File copied from [${sourcePathFile}] to [${CSV_BUCKET}/${destinationFile}].`,
          );

          const deleteObjectParams = {
            Bucket: CSV_BUCKET,
            Key: record.s3.object.key,
          };
          const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
          await s3Client.send(deleteCommand);
          console.log(`File [${deleteObjectParams.Key}] deleted`);
        });
    });

    await Promise.all(promises);
    return SuccessJSONResponse(StatusCodes.OK, 'Parsed');
  } catch (error) {
    console.log(error);
    return ErrorJSONResponse(StatusCodes.INTERNAL_SERVER_ERROR, error);
  }
};

export const main = middyfy(importFileParser);
