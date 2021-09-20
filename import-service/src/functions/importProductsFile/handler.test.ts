import { mockClient } from 'aws-sdk-client-mock';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StatusCodes } from 'http-status-codes';

import { APIGatewayProxyResult } from 'aws-lambda';
import createEvent from 'mock-aws-events';
import type { GetImportProductsFileAPIGatewayProxyEvent } from '@libs/apiGateway';
import { importProductFile } from './handler';
import { httpContextMock } from './mock';

const s3Mock = mockClient(S3Client);

beforeEach(() => {
  s3Mock.reset();
});

describe('importProductFile tests', () => {
  test.only('should get all products', async () => {
    const event = createEvent('aws:apiGateway', {
      queryStringParameters: {
        name: 'mock.csv',
      },
    });
    const cb = jest.fn();
    s3Mock.on(PutObjectCommand)
    .resolves({'url'})


    const result = <APIGatewayProxyResult>(
      await importProductFile(
        <GetImportProductsFileAPIGatewayProxyEvent>event,
        httpContextMock,
        cb,
      )
    );

    expect(result.statusCode).toEqual(StatusCodes.OK);
    // expect(result).toMatchSchema(ProductsSchema);
  });
});
