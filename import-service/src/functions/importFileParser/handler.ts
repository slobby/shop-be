/* eslint-disable no-console */
import 'source-map-support/register';
import { S3Client, ListObjectsV2Command, _Object  } from "@aws-sdk/client-s3";
import { StatusCodes } from 'http-status-codes';

import { middyfy } from '@libs/lambda';
import type { Handler } from 'aws-lambda';

const importProductFile: Handler = async (_event) => {
  try {
    const { CSV_BUCKET, CSV_INPUT_FOLDER } = process.env;
    const clientParams = { region: 'eu-west-1' };
    const listObjectParams = {
      Bucket: CSV_BUCKET,
      Prefix: `${CSV_INPUT_FOLDER}`,
      Delimiter: '',
    };

    const client = new S3Client(clientParams);
    const command = new ListObjectsV2Command (listObjectParams);
    const listObject = await client.send(command)
    console.log(listObject)
    if (listObject.Contents) {
      listObject.Contents.forEach((ob) => {
        console.log(ob.Key)
      }) 
    }
  } 
  catch (error) {
    console.log(error);
  }
};

export const main = middyfy(importProductFile);
