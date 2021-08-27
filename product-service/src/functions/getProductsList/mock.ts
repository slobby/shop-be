export const httpContextMock = {
  callbackWaitsForEmptyEventLoop: true,
  functionName: '',
  functionVersion: '',
  invokedFunctionArn: '',
  memoryLimitInMB: '',
  awsRequestId: '',
  logGroupName: '',
  logStreamName: '',
  getRemainingTimeInMillis: () => 2,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  done: (): void => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  fail: (_error): void => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  succeed: (_message): void => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // succeed: (_message, _object): void => {},
};

export const httpEventUnExpectedMock = {
  pathParameters: { productId: '' },
};
