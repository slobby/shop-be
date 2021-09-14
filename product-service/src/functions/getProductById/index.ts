import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: '/products/{productId}',
        method: 'get',
        cors: true,
        request: {
          parameters: { paths: { productId: true } },
        },
      },
    },
  ],
};
