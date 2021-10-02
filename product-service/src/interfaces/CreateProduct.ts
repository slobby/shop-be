import { FromSchema } from 'json-schema-to-ts';
import createProductSchema from './createFromSNSProductSchema';

export type CreateProduct = FromSchema<typeof createProductSchema>;
