BEGIN TRANSACTION;

CREATE TABLE users(
    inn BIGINT PRIMARY KEY,
    kpp BIGINT,
    name VARCHAR(128),
    email VARCHAR(128),
    phone BIGINT,
    contact VARCHAR(128),
    address VARCHAR(256),
    joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;