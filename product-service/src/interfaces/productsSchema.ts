import productSchema from './productSchema';

export default {
  type: 'array',
  items: { type: productSchema },
  additionalProperties: false,
} as const;
