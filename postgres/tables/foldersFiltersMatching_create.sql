BEGIN TRANSACTION;

CREATE TABLE folders_filters_matching(
    filter INTEGER PRIMARY KEY,
    folder INTEGER PRIMARY KEY,
    filterOrder INTEGER,
    updated TIMESTAMP
);

COMMIT;