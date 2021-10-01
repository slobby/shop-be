/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import catalogBatchProcess from '@functions/catalogBatchProcess';

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
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          DelaySeconds: 0,
          MaximumMessageSize: 1024,
          MessageRetentionPeriod: 360,
          QueueName: 'import-service-sqs-queue',
          ReceiveMessageWaitTimeSeconds: 20,
          RedriveAllowPolicy: {
            redrivePermission: 'denyAll',
          },
          VisibilityTimeout: 360,
        },
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'my topic',
          TopicName: 'import-service-sns-topic',
        },
      },
      createProductTopicSubscription1: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'aws-condition1@rambler.ru',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            quantity: [{ numeric: ['<', 10] }],
          },
        },
      },
      createProductTopicSubscription2: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'aws-condition2@rambler.ru',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic',
          },
          FilterPolicy: {
            quantity: [{ numeric: ['>=', 10] }],
          },
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
      PG_HOST: '${env:PG_HOST}',
      PG_DATABASE: '${env:PG_DATABASE}',
      PG_PORT: '${env:PG_PORT}',
      PG_USER: '${env:PG_USER}',
      PG_PASSWORD: '${env:PG_PASSWORD}',
      CSV_BUCKET: '${env:CSV_BUCKET}',
      CSV_INPUT_FOLDER: '${env:CSV_INPUT_FOLDER}',
      CSV_OUTPUT_FOLDER: '${env:CSV_OUTPUT_FOLDER}',
      SQS_PARCE_URL: {
        Ref: 'catalogItemsQueue',
      },
      SNS_ARN: {
        Ref: 'createProductTopic',
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
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::GetAtt': ['catalogItemsQueue', 'Arn'] },
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: { Ref: 'createProductTopic' },
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
    catalogBatchProcess,
  },
};

module.exports = serverlessConfiguration;
