import { mockClient } from 'aws-sdk-client-mock';
import { S3Client, GetObjectCommand,   
  } from '@aws-sdk/client-s3';

import createEvent from 'mock-aws-events';
import { importFileParser } from './handler';
import { httpContextMock } from './mock';

const s3Mock = mockClient(S3Client);

beforeEach(() => {
  s3Mock.reset();
});

describe('importFileParser tests', () => {
  test.only('should get all products', async () => {
    s3Mock.on(GetObjectCommand)
    .resolves({ ContentType: 'text/csv'});
    const event = createEvent('aws:s3', {});
    const cb = jest.fn();


    await importFileParser(
        event,
        httpContextMock,
        cb,
      );

      console.log(s3Mock.calls().length);
    

    // expect(result.statusCode).toEqual(StatusCodes.OK);
    // expect(result).toMatchSchema(ProductsSchema);
  });
});
