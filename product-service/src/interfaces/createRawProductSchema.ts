export default {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    count: { type: 'string', minLength: 1 },
    price: { type: 'string', minLength: 1 },
    image: { type: 'string', minLength: 1 },
  },
  required: ['title', 'description', 'count', 'price', 'image'],
  additionalProperties: false,
} as const;
