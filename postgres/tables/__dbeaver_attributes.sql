-- Drop table

-- DROP TABLE public."attributes";

CREATE TABLE public."attributes" (
	code int4 NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT attributes_pk PRIMARY KEY (code)
);
