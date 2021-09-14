export default {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    count: { type: 'integer', minimum: 0 },
    price: { type: 'number', minimum: 0, exclusiveMinimum: true },
    image: { type: 'string', minLength: 1 },
  },
  required: ['title', 'description', 'count', 'price', 'image'],
  additionalProperties: false,
} as const;
