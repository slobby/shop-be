export const uncaughtExceptionHandler = (error: Error): void => {
  process.stdout.write(`uncaughtException, ${error}`);
  process.exit(1);
};
