BEGIN TRANSACTION;

CREATE TABLE goodsAttributes(
    good INTEGER,
    attribute INTEGER,
    value VARCHAR(128)
);

COMMIT;