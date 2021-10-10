import { Client } from 'pg';
import { CreateProduct } from '@interfaces/CreateProduct';
import { connectionOptions } from '@database/config';

export class ProductService {
  public static async createProduct(product: CreateProduct): Promise<string> {
    const client = new Client(connectionOptions);
    try {
      await client.connect();
      const { title, description, count, price, image } = product;
      await client.query('BEGIN');
      const result = await client.query<{ id: string }>(
        `INSERT INTO public.products (id, title, description, price, image)
      VALUES (DEFAULT, $1, $2, $3, $4) RETURNING id`,
        [title, description, price, image],
      );
      if (result.rowCount === 1 && result.rows[0]) {
        await client.query(
          'INSERT INTO public.stocks (product_id, count) VALUES ($1, $2)',
          [result.rows[0].id, count],
        );
        await client.query('COMMIT');
        return result.rows[0].id;
      }
      throw new Error(`[Error!]: Couldn't save Product in database`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      await client.end();
    }
  }
}
