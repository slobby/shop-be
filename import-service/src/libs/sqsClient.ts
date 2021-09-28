import { SQSClient } from '@aws-sdk/client-sqs';

const clientParams = { region: 'eu-west-1' };

export const sqsClient = new SQSClient(clientParams);
