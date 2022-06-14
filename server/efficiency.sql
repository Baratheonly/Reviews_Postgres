-- CREATE INDEXES TO IMPROVE EFFICIENCY OF FINDING DATA
-- THEY DO ADD OVERHEAD TO THE DBS AS A WHOLE
-- https://www.postgresql.org/docs/current/indexes.html#:~:text=An%20index%20allows%20the%20database,they%20should%20be%20used%20sensibly.
-------------------------------------------------------------------------
\c sdc;

CREATE INDEX reviews_product_id_index ON reviews (product_id);

CREATE INDEX reviews_helpfulness_index ON reviews (helpfulness DESC);

CREATE INDEX reviews_date_index ON reviews (date DESC);

CREATE INDEX characteristics_product_id_index ON characteristics (product_id);