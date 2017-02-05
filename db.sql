CREATE TABLE foodbase (
    id SERIAL PRIMARY KEY,
    food_date date,
    food_name character varying(100),
    food_amount double precision,
    food_place character varying(50),
    food_category text
);

CREATE TABLE testbase (
    id SERIAL PRIMARY KEY,
    item_date date,
    item_name character varying(100),
    item_amount double precision,
    item_place character varying(50),
    item_category text
);
