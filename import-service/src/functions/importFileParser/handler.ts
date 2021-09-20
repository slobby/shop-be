/* eslint-disable no-console */
import 'source-map-support/register';
import {
  GetObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import csv from 'csv-parser';

import { middyfy } from '@libs/lambda';

import { s3Client } from '@libs/s3Client';
import type { Handler, S3Event } from 'aws-lambda';

declare const process: {
  env: {
    CSV_BUCKET: string;
    CSV_INPUT_FOLDER: string;
    CSV_OUTPUT_FOLDER: string;
  };
};

const importProductFile: Handler<S3Event> = async (event) => {
  try {
    const { CSV_BUCKET, CSV_INPUT_FOLDER, CSV_OUTPUT_FOLDER } = process.env;

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
        .on('data', (chunk) => {
          console.log(`Received - ${JSON.stringify(chunk)}.`);
        })
        .on('error', (error) => {
          console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};

export const main = middyfy(importProductFile);
