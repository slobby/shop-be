import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyResult } from 'aws-lambda';
import createEvent from 'mock-aws-events';
import type { GetImportProductsFileAPIGatewayProxyEvent } from '@libs/apiGateway';

import * as S3 from '@aws-sdk/s3-request-presigner';
import { importProductFile } from './handler';
import { httpContextMock } from './mock';

jest.mock('@aws-sdk/s3-request-presigner');
const spy = jest.spyOn(S3, 'getSignedUrl').mockImplementation(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve('testurl.com'), 50);
    }),
);

beforeEach(() => {
  spy.mockRestore();
});

describe('importProductFile tests', () => {
  test.only('should get url', async () => {
    const event = createEvent('aws:apiGateway', {
      queryStringParameters: {
        name: 'mock.csv',
      },
    });
    const cb = jest.fn();
    const result = <APIGatewayProxyResult>(
      await importProductFile(
        <GetImportProductsFileAPIGatewayProxyEvent>event,
        httpContextMock,
        cb,
      )
    );
    console.log(result);

    expect(result.statusCode).toEqual(StatusCodes.OK);
    // expect(result).toMatchSchema(ProductsSchema);
  });
});
