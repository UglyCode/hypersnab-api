BEGIN TRANSACTION;

CREATE TABLE goods(
    id serial PRIMARY KEY,
    good INTEGER(16) NOT NULL,
    client INTEGER(16) NOT NULL,
    amount NUMERIC(16) NOT NULL,
    price NUMERIC(16) NOT NULL,
    status VARCHAR(64),
    updated TIMESTAMP
);

COMMIT;