export default {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    count: { type: 'integer', minimum: 0 },
    price: { type: 'number', minimum: 0, exclusiveMinimum: 0 },
    image: { type: 'string', minLength: 1 },
  },
  required: ['id', 'title', 'description', 'count', 'price', 'image'],
  additionalProperties: false,
} as const;
