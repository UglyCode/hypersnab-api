BEGIN TRANSACTION;

CREATE TABLE users(
    inn INTEGER(16) PRIMARY KEY,
    kpp INTEGER(16),
    name VARCHAR(128),
    email VARCHAR(128),
    phone INTEGER(32),
    contact VARCHAR(128),
    address VARCHAR(256)
    joined TIMESTAMP NOT NULL
);

COMMIT;