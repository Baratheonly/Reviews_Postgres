-- POPULATED DATA INTO POSTGRESQL USING pgAdmin. These were the queries written in the process
-------------------------------------------------------------------------
-- DROP DATABASE sdc;
CREATE DATABASE sdc;

\c sdc;

-- Table: public.reviews
-- DROP TABLE IF EXISTS public.reviews;

CREATE TABLE IF NOT EXISTS public.reviews
(
    id integer NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
    product_id integer NOT NULL,
    rating integer NOT NULL,
    summary character varying(200) COLLATE pg_catalog."default" NOT NULL,
    body character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    recommend boolean NOT NULL DEFAULT false,
    reported boolean NOT NULL DEFAULT false,
    reviewer_name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    reviewer_email character varying(100) COLLATE pg_catalog."default" NOT NULL,
    response character varying(1000) COLLATE pg_catalog."default" NOT NULL,
    helpfulness integer NOT NULL DEFAULT 0,
    date bigint NOT NULL,
    CONSTRAINT reviews_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.reviews
    OWNER to aaronbowers;

-- TRANSFORM THE DATE DATA INTO TIMESTAMP
ALTER TABLE reviews
ALTER COLUMN date
TYPE timestamp with time zone
USING to_timestamp(date::decimal / 1000)

-- Table: public.review_photos
-- DROP TABLE IF EXISTS public.review_photos;

CREATE TABLE IF NOT EXISTS public.review_photos
(
    id integer NOT NULL DEFAULT nextval('review_photos_id_seq'::regclass),
    review_id integer NOT NULL,
    url character varying(256) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT review_photos_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.review_photos
    OWNER to aaronbowers;

