/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: '/products',
        method: 'post',
        cors: true,
        request: {
          schemas: {
            'application/json': {
              schema: '${file(CreateProductSchema.json)}',
              name: 'PostCreateModel',
              description: 'Validation model for Creating Posts',
            },
          },
        },
      },
    },
  ],
};
