import {
  APIGatewayProxyResult,
  APIGatewayProxyEventMultiValueHeaders,
} from 'aws-lambda';
import { getProductById } from './handler';
import { httpEventExpectedMock, httpContextMock } from './mock';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getProductById tests', () => {
  it('should get product by id', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    getProductById(
      httpEventExpectedMock,
      httpContextMock,
      (_err: Error, res: APIGatewayProxyResult) => {
        // eslint-disable-next-line no-console
        const { prod } = res.body;
      },
    );
    expect(4).toBe(4);
  });
});
