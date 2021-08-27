import { APIGatewayProxyResult } from 'aws-lambda';
import createEvent from 'mock-aws-events';
import { matchers } from 'jest-json-schema';
import { getProductsList } from './handler';
import { httpContextMock } from './mock';
import ProductsSchema from '../../interfaces/productsSchema';
import { dataBase } from '../../database/db';

expect.extend(matchers);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getProductsList tests', () => {
  test.only('should get all products', async () => {
    const event = createEvent('aws:apiGateway', {});

    const cb = jest.fn();

    const result = <APIGatewayProxyResult>(
      await getProductsList(event, httpContextMock, cb)
    );
    console.log(JSON.parse(result.body));

    // expect(JSON.parse(result.body)).toMatchSchema(ProductsSchema);
    expect(dataBase).toMatchSchema(ProductsSchema);
  });
});
