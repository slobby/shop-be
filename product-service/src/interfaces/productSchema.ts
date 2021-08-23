export default {
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    count: { type: 'integer' },
    price: { type: 'number' },
    image: { type: 'string' },
  },
  required: ['id', 'title', 'description', 'count', 'price', 'image'],
  additionalProperties: false,
} as const;
