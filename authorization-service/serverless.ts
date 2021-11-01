import type { AWS } from '@serverless/typescript';

import basicAuthorizer from '@functions/basicAuthorizer';

const serverlessConfiguration: AWS = {
  service: 'authorization-service',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  useDotenv: true,
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: ['serverless-esbuild'],
  resources: {
    Outputs: {
      TokenLambdaFuncionAuthorizerArn: {
        Description: 'The ARN for the basicAuthorizer function',
        Value: {
          'Fn::GetAtt': ['BasicAuthorizerLambdaFunction', 'Arn'],
        },
        Export: {
          Name: '${self:service}:tokenAuthorizerArn',
        },
      },
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: 'dev',
    region: 'eu-west-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SLOBBY: '${env:SLOBBY}',
    },
    lambdaHashingVersion: '20201221',
  },
  package: {
    individually: true,
  },
  // import the function via paths
  functions: { basicAuthorizer },
};

module.exports = serverlessConfiguration;
