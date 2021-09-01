require('dotenv').config();

const { PG_HOST, PG_DATABASE, PG_USER, PG_PORT, PG_PASSWORD } = process.env;

const connectionOptions = {
  host: PG_HOST,
  database: PG_DATABASE,
  user: PG_USER,
  port: parseInt(PG_PORT, 10),
  password: PG_PASSWORD,
};

console.log(connectionOptions);
