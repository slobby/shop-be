CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE public.products IF EXISTS;

CREATE TABLE public.products (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    title text,
    description text,
    price decimal,
    image text,
);
