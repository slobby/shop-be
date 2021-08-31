INSERT INTO public.stock
VALUES (
    '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    'Aligote',
    'Wine',
    12.4,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/1.jpeg'
)

INSERT INTO public.products
VALUES (
    '7567ec4b-b10c-48c5-9345-fc73c48a80a0',
    'Cavit',
    'Wine delicious',
    10.9,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/2.jpeg'
)

INSERT INTO public.products
VALUES (
    '7567ec4b-b10c-48c5-9345-fc73c48a80a2',
    'Cabernet',
    'Short Product Description2',
    23.4,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/3.jpeg'
)

INSERT INTO public.products
VALUES (
    '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    'Brud',
    'Short Product Description4',
    15.5,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/4.jpeg'
)

INSERT INTO public.products
VALUES (
    '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
    'Chili',
    'Short Product Description4',
    26.6,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/5.jpeg'
)

INSERT INTO public.products
VALUES (
    '7567ec4b-b10c-48c5-9345-fc73348a80a1',
    'BlueBerry',
    'Short Product Description4',
    17.7,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/6.jpeg'
)

INSERT INTO public.products
VALUES (
    '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
    'Apple wine',
    'Short Product Description4',
    29.9,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/7.jpeg'
)

INSERT INTO public.products
VALUES (
    '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
    'Faustino',
    'Short Product Description4',
    15.3,
    'https://s3uploader-s3uploadbucket-4dju787ezzkp.s3.eu-west-1.amazonaws.com/8.jpeg'
)

-- ADD stock


INSERT INTO public.stock (product_id, count)
VALUES ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 10),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a0',15),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a2',16),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a1',88),
       ('7567ec4b-b10c-48c5-9345-fc73c48a80a3',2),
       ('7567ec4b-b10c-48c5-9345-fc73348a80a1',32),
       ('7567ec4b-b10c-48c5-9445-fc73c48a80a2',84),
       ('7567ec4b-b10c-45c5-9345-fc73c48a80a1',41)