export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    count: { type: 'integer', minimum: 0 },
    price: { type: 'number', exclusiveMinimum: 0 },
    image: { type: 'string' },
  },
  required: ['id', 'title', 'description', 'count', 'price', 'image'],
  additionalProperties: false,
} as const;
