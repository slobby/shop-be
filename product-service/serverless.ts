/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import getProductById from '@functions/getProductById';
import getProductsList from '@functions/getProductsList';
import postCreateProduct from '@functions/postCreateProduct';

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
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { getProductById, getProductsList, postCreateProduct },
};

module.exports = serverlessConfiguration;
