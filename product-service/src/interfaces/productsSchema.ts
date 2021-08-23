import productSchema from '@interfaces/productSchema';

export default {
  type: 'array',
  items: { type: productSchema },
  additionalProperties: false,
} as const;
