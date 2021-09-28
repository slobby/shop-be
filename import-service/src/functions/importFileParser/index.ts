/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${env:CSV_BUCKET}',
        event: 's3:ObjectCreated:*',
        rules: [ 
          { prefix: 'uploaded/'},
          { suffix: '.csv'}
        ],
        existing: true
      },
    },
  ],
};
