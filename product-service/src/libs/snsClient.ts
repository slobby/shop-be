import { SNSClient } from '@aws-sdk/client-sns';

const clientParams = { region: 'eu-west-1' };

export const snsClient = new SNSClient(clientParams);
