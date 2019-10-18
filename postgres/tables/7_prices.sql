-- Drop table

-- DROP TABLE public.prices;

CREATE TABLE public.prices (
	good varchar(16) NOT NULL,
	price float4 NOT NULL DEFAULT 0,
	updated timestamp NOT NULL DEFAULT now(),
	spec bool NOT NULL DEFAULT false,
	CONSTRAINT prices_pk PRIMARY KEY (good),
	CONSTRAINT prices_fk FOREIGN KEY (good) REFERENCES goods(code)
);

