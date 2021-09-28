import { FromSchema } from 'json-schema-to-ts';
import createProductSchema from './createProductSchema';

export type CreateProduct = FromSchema<typeof createProductSchema>;
