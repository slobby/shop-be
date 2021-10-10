/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {
          'Fn::ImportValue': 'import-service:catalogItemsSQS',
        },
        batchSize: 5,
        enabled: true,
      },
    },
  ],
};
