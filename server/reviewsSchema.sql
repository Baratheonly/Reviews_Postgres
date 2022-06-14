-- POPULATED DATA INTO POSTGRESQL USING pgAdmin. These were the queries written in the process
-------------------------------------------------------------------------
DROP DATABASE IF EXISTS sdc;
CREATE DATABASE sdc;

\c sdc;

DROP TABLE IF EXISTS reviews;
CREATE TABLE IF NOT EXISTS reviews(
    review_id serial PRIMARY KEY,
    product_id integer NOT NULL,
    rating integer NOT NULL,
    summary text NOT NULL,
    body text NOT NULL,
    recommend boolean NOT NULL DEFAULT false,
    reported boolean NOT NULL DEFAULT false,
    reviewer_name text NOT NULL,
    reviewer_email text NOT NULL,
    response text COLLATE pg_catalog."default",
    helpfulness integer NOT NULL DEFAULT 0,
    date bigint NOT NULL
);

DROP TABLE IF EXISTS review_photos CASCADE;
CREATE TABLE IF NOT EXISTS review_photos(
    id integer NOT NULL DEFAULT nextval('review_photos_id_seq'::regclass),
    review_id integer NOT NULL REFERENCES reviews (review_id),
    url character varying(256) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT review_photos_pkey PRIMARY KEY (id)
);

DROP TABLE IF EXISTS characteristics CASCADE;
CREATE TABLE IF NOT EXISTS characteristics(
    id integer NOT NULL DEFAULT nextval('characteristics_id_seq'::regclass),
    product_id integer NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT characteristics_pkey PRIMARY KEY (id)
)

DROP TABLE IF EXISTS public.characteristic_reviews;
CREATE TABLE IF NOT EXISTS public.characteristic_reviews(
    id integer NOT NULL DEFAULT nextval('characteristic_reviews_id_seq'::regclass),
    characteristic_id integer,
    review_id integer,
    value integer NOT NULL,
    CONSTRAINT characteristic_reviews_pkey PRIMARY KEY (id),
    CONSTRAINT characteristic_reviews_characteristic_id_fkey FOREIGN KEY (characteristic_id)
        REFERENCES public.characteristics (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT characteristic_reviews_review_id_fkey FOREIGN KEY (review_id)
        REFERENCES public.reviews (review_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

-- LOAD DATA INTO THEIR RESPECTIVE TABLES
COPY reviews (review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
FROM '/Users/aaronbowers/Desktop/hackreactor/CSV/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY review_photos (review_id, url)
FROM '/Users/aaronbowers/Desktop/hackreactor/CSV/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY characteristics (id, product_id, name)
FROM '/Users/aaronbowers/Desktop/hackreactor/CSV/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY characteristic_reviews (id, characteristic_id, review_id, value)
FROM '/Users/aaronbowers/Desktop/hackreactor/CSV/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;

-- TRANSFORM THE DATE DATA INTO TIMESTAMP
ALTER TABLE reviews
ALTER COLUMN date
TYPE timestamp with time zone
USING to_timestamp(date / 1000);
