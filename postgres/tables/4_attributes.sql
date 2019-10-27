-- Drop table

-- DROP TABLE public."attributes";

CREATE TABLE public."attributes" (
	code int4 NOT NULL,
	attribute_name varchar NOT NULL,
	CONSTRAINT attributes_pk PRIMARY KEY (code)
);
