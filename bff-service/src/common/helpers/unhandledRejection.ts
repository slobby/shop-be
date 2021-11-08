export const unhandledRejectionHandler = (
  error: Error,
  _promise: Promise<Error>,
): void => {
  process.stdout.write(`unhandledRejection, ${error}`);
  process.exit(1);
};
