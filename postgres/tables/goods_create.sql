BEGIN TRANSACTION;

CREATE TABLE goods(
    code INTEGER PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    description VARCHAR(512),
    measure VARCHAR(32),
    available BIT,
    image VARCHAR(256),
    updated TIMESTAMP
);

COMMIT;