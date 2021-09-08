import productSchema from './productSchema';

export default {
  type: 'array',
  items: productSchema,
  additionalProperties: false,
} as const;
