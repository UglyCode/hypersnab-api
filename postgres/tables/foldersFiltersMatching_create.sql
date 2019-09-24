BEGIN TRANSACTION;

CREATE TABLE folders_filters_matching(
    id serial PRIMARY KEY,
    filter INTEGER,
    folder INTEGER,
    filterOrder INTEGER,
    updated TIMESTAMP
);

COMMIT;