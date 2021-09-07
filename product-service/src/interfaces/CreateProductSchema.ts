export default {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    count: { type: 'integer', minimum: 0 },
    price: { type: 'number', minimum: 0, exclusiveMinimum: true },
    image: { type: 'string' },
  },
  required: ['title', 'description', 'count', 'price', 'image'],
  additionalProperties: false,
} as const;
