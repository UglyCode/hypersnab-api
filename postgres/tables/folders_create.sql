BEGIN TRANSACTION;

CREATE TABLE folders(
    code INTEGER PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    level INTEGER,
    parent INTEGER,
    image VARCHAR(256),
    updated TIMESTAMP
);

COMMIT;