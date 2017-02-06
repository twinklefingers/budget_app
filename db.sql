CREATE TABLE foodbase (
    id SERIAL PRIMARY KEY,
    food_date date,
    food_name character varying(100),
    food_amount double precision,
    food_place character varying(50),
    food_category text
);

CREATE TABLE budgetbase (
    id SERIAL PRIMARY KEY,
    budget_date date,
    budget_name character varying(100),
    budget_expense double precision,
    budget_income double precision,
    budget_category text
);
