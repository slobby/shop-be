import { APIGatewayProxyResult } from 'aws-lambda';
import createEvent from 'mock-aws-events';
import { matchers } from 'jest-json-schema';
import { GetProductByIdAPIGatewayProxyEvent } from '@libs/apiGateway';
import { getProductById } from './handler';
import { httpContextMock } from './mock';
import ProductSchema from '../../interfaces/productSchema';

expect.extend(matchers);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getProductById tests', () => {
  test('should return error 400', async () => {
    const event = createEvent('aws:apiGateway', {
      pathParameters: {
        product: '7567ec4b-b10c-48c5-9345-fc73c48a80a7',
      },
    });

    const cb = jest.fn();

    const result = <APIGatewayProxyResult>(
      await getProductById(
        <GetProductByIdAPIGatewayProxyEvent<{ productId: string }>>event,
        httpContextMock,
        cb,
      )
    );
    expect(result).toHaveProperty('statusCode', 400);
  });

  test('should get product by id', async () => {
    const event = createEvent('aws:apiGateway', {
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
      },
    });

    const cb = jest.fn();

    const result = <APIGatewayProxyResult>(
      await getProductById(
        <GetProductByIdAPIGatewayProxyEvent<{ productId: string }>>event,
        httpContextMock,
        cb,
      )
    );
    expect(JSON.parse(result.body)).toMatchSchema(ProductSchema);
  });

  test('should return error 404', async () => {
    const event = createEvent('aws:apiGateway', {
      pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80a7',
      },
    });

    const cb = jest.fn();

    const result = <APIGatewayProxyResult>(
      await getProductById(
        <GetProductByIdAPIGatewayProxyEvent<{ productId: string }>>event,
        httpContextMock,
        cb,
      )
    );
    expect(result).toHaveProperty('statusCode', 404);
  });
});
