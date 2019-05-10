BEGIN TRANSACTION;

CREATE TABLE prices(
    good BIGINT PRIMARY KEY,
    price NUMERIC(16,2),
    special BIT,
    updated TIMESTAMP
);

COMMIT;