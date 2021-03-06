BEGIN TRANSACTION;

CREATE TABLE orders(
    id serial PRIMARY KEY,
    good BIGINT NOT NULL,
    client BIGINT NOT NULL,
    amount NUMERIC(16,2) NOT NULL,
    price NUMERIC(16,2) NOT NULL,
    status VARCHAR(64),
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;