/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import getProductById from '@functions/getProductById';
import getProductsList from '@functions/getProductsList';
import postCreateProduct from '@functions/postCreateProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline'],
  resources: {
    Resources: {
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          DisplayName: 'my topic',
          TopicName: 'service-sns-topic',
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
      SNS_ARN: {
        Ref: 'createProductTopic',
      },
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: { 'Fn::ImportValue': 'import-service:catalogItemsSQS' },
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
    getProductById,
    getProductsList,
    postCreateProduct,
    catalogBatchProcess,
  },
};

module.exports = serverlessConfiguration;
