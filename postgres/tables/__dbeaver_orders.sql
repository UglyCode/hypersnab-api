-- Drop table

-- DROP TABLE public.orders;

CREATE TABLE public.orders (
	id serial NOT NULL,
	client int8 NOT NULL,
	status varchar(16) NOT NULL,
	updated timestamp NOT NULL DEFAULT now(),
	CONSTRAINT order_pk PRIMARY KEY (id),
	CONSTRAINT order_fk FOREIGN KEY (client) REFERENCES users(inn)
);

