import { APIGatewayProxyResult } from 'aws-lambda';
// import { matchers } from 'jest-json-schema';
import { ProductService } from '@libs/ProductService ';
import { CreateProduct } from '@interfaces/CreateProduct';
import { catalogBatchProcess } from './handler';
import { httpContextMock } from './mock';
import { snsClient } from '@libs/snsClient';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('catalogBatchProcess tests', () => {
  test('should return error 500. Couldn`t convert recieved record ', async () => {
    const SQSevent = {
      Records: [
        {
          messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
          receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
          body: JSON.stringify({
            title: 'Test-Title',
            description: 'Test-description',
            count: 1,
            price: 1.5,
            image: 4,
          }),
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1545082649183',
            SenderId: 'AIDAIENQZJOLO23YVJ4VO',
            ApproximateFirstReceiveTimestamp: '1545082649185',
          },
          messageAttributes: {},
          md5OfBody: '098f6bcd4621d373cade4e832627b4f6',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
          awsRegion: 'us-east-2',
        },
      ],
    };

    const cb = jest.fn();

    const result = <APIGatewayProxyResult>(
      await catalogBatchProcess(SQSevent, httpContextMock, cb)
    );
    expect(result).toHaveProperty('statusCode', 500);
    expect(result).toHaveProperty(
      'body',
      `{"message":"[Error!]: Couldn't convert recieved record to Protuct type - {\\"title\\":\\"Test-Title\\",\\"description\\":\\"Test-description\\",\\"count\\":1,\\"price\\":1.5,\\"image\\":4}"}`,
    );
  });

  test('should return 200. Handled all records', async () => {
    const SQSevent = {
      Records: [
        {
          messageId: '059f36b4-87a3-44ab-83d2-661975830a7d',
          receiptHandle: 'AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...',
          body: JSON.stringify({
            title: 'Test-Title',
            description: 'Test-description',
            count: 1,
            price: 1.5,
            image: 'Test-description',
          }),
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1545082649183',
            SenderId: 'AIDAIENQZJOLO23YVJ4VO',
            ApproximateFirstReceiveTimestamp: '1545082649185',
          },
          messageAttributes: {},
          md5OfBody: '098f6bcd4621d373cade4e832627b4f6',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-2:123456789012:my-queue',
          awsRegion: 'us-east-2',
        },
      ],
    };
    const cb = jest.fn();
    const spyCreateProduct = jest
      .spyOn(ProductService, 'createProduct')
      .mockImplementation(
        (_product: CreateProduct): Promise<string> => Promise.resolve('uuid'),
      );

    const PublishCommand = jest
      .spyOn(snsClient, 'send')
      .mockImplementation(
        (_input): Promise<string> => Promise.resolve('Sent to email'),
      );

    const result = <APIGatewayProxyResult>(
      await catalogBatchProcess(SQSevent, httpContextMock, cb)
    );
    expect(spyCreateProduct).toHaveBeenCalled();
    expect(PublishCommand).toHaveBeenCalled();
    expect(result).toHaveProperty('statusCode', 200);
    expect(result).toHaveProperty('body', `"Handled all records"`);
    spyCreateProduct.mockRestore();
    PublishCommand.mockRestore();
  });
});
