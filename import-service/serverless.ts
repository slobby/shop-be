/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
// import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  resources: {
    Resources: {
      SQSParce: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          DelaySeconds: 0,
          MaximumMessageSize: 1024,
          MessageRetentionPeriod: 360,
          QueueName: 'import-service-parce-sqs-queue',
          ReceiveMessageWaitTimeSeconds: 20,
          RedriveAllowPolicy: {
            redrivePermission: 'denyAll',
          },
          VisibilityTimeout: 360,
        },
      },
    },
  },

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      CSV_BUCKET: '${env:CSV_BUCKET}',
      CSV_INPUT_FOLDER: '${env:CSV_INPUT_FOLDER}',
      CSV_OUTPUT_FOLDER: '${env:CSV_OUTPUT_FOLDER}',
      SQS_PARCE_URL: {
        Ref: 'SQSParce',
      },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::${env:CSV_BUCKET}'],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: ['arn:aws:s3:::${env:CSV_BUCKET}/*'],
      },
    ],
  },
  package: {
    individually: true,
  },

  // import the function via paths
  functions: {
    importProductsFile,
    importFileParser,
    // catalogBatchProcess
  },
};

module.exports = serverlessConfiguration;
