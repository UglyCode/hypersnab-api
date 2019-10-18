-- Drop table

-- DROP TABLE public.stock;

CREATE TABLE public.stock (
	good varchar(16) NOT NULL,
	stock int4 NOT NULL DEFAULT 0,
	maxorder int4 NULL,
	updated timestamp NOT NULL DEFAULT now(),
	CONSTRAINT stock_pk PRIMARY KEY (good),
	CONSTRAINT stock_fk FOREIGN KEY (good) REFERENCES goods(code)
);
