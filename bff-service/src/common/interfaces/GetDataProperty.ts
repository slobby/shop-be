import { Method } from 'axios';

export type GetDataProperty = {
  method: Method;
  recipientURL: string;
  originalUrl: string;
  body: any;
};
