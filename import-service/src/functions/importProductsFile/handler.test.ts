import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyResult } from 'aws-lambda';
import createEvent from 'mock-aws-events';
import type { GetImportProductsFileAPIGatewayProxyEvent } from '@libs/apiGateway';

import * as S3 from '@aws-sdk/s3-request-presigner';
import { importProductFile } from './handler';
import { httpContextMock } from './mock';

jest.mock('@aws-sdk/s3-request-presigner');
let spy;

// beforeEach(() => {
//   spy.mockRestore();
// });

describe('importProductFile tests', () => {
  test('should get url', async () => {
    spy = jest.spyOn(S3, 'getSignedUrl').mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve('testurl.com'), 50);
        }),
    );
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
    
    expect(spy).toHaveBeenCalled();
    expect(result.statusCode).toEqual(StatusCodes.OK);
    expect(result.body).toEqual(JSON.stringify('testurl.com'));
    spy.mockRestore();
  });

  test('should get error', async () => {
    spy = jest.spyOn(S3, 'getSignedUrl').mockImplementation(
      () =>
        new Promise((_resolve, reject) => {
          setTimeout(() => reject(new Error('Test error')), 50);
        }),
    );
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
    
    expect(spy).toHaveBeenCalled();
    expect(result.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    spy.mockRestore();
  });
});
