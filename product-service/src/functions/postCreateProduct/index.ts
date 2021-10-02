/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handlerResolver';
import CreateProductSchema from '@interfaces/createProductSchema';

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
              schema: CreateProductSchema,
              name: 'PostCreateModel',
              description: 'Validation model for Creating Posts',
            },
          },
        },
      },
    },
  ],
};
