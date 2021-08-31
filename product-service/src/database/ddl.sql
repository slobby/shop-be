CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.stocks;

CREATE TABLE public.products (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    title text,
    description text,
    price numeric CHECK (price > 0),
    image text,
);


CREATE TABLE public.stocks (
    id SERIAL PRIMARY KEY,
    product_id uuid NOT NULL UNIQUE REFERENCES public.products (id) ON DELETE CASCADE,
    count integer
);

