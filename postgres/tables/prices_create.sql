BEGIN TRANSACTION;

CREATE TABLE goods(
    good INTEGER(16) PRIMARY KEY,
    price NUMERIC(16),
    special BIT,
    updated TIMESTAMP
);

COMMIT;