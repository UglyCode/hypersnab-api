BEGIN TRANSACTION;

CREATE TABLE stock(
    good INTEGER PRIMARY KEY,
    amount NUMERIC(10,2),
    maxorder INTEGER,
    updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;