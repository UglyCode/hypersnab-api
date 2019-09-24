BEGIN TRANSACTION;

CREATE TABLE goods(
    code INTEGER PRIMARY KEY,
    folder INTEGER NOT NULL,
    description VARCHAR(512),
    measure VARCHAR(32),
    available BOOLEAN,
    image VARCHAR(256),
    updated TIMESTAMP
);

COMMIT;