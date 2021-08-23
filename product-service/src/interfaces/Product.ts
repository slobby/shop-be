import { FromSchema } from "json-schema-to-ts";
import productSchema from '@interfaces/productSchema'; 

export type Product = FromSchema<typeof productSchema>