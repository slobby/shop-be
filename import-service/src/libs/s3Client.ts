import { S3Client } from '@aws-sdk/client-s3';

const clientParams = { region: 'eu-west-1' };

export const s3Client = new S3Client(clientParams);
