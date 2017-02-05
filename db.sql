CREATE TABLE testbase (
    id SERIAL PRIMARY KEY,
    item_date date,
    item_name character varying(100),
    item_amount double precision,
    item_place character varying(50)
);
