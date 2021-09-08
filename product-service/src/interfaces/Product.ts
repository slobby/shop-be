import { FromSchema } from 'json-schema-to-ts';
import productSchema from './productSchema';

export type Product = FromSchema<typeof productSchema>;
