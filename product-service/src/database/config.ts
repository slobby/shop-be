import { ClientConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { PG_HOST, PG_DATABASE, PG_USER, PG_PORT, PG_PASSWORD } = process.env;

export const connectionOptions: ClientConfig = {
  host: PG_HOST,
  database: PG_DATABASE,
  user: PG_USER,
  port: parseInt(<string>PG_PORT, 10),
  password: PG_PASSWORD,
};

console.log('From config');
console.log(connectionOptions);
