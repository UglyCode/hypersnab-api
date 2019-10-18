-- Drop table

-- DROP TABLE public.login;

CREATE TABLE public.login (
	id serial NOT NULL,
	hash varchar NOT NULL,
	inn int8 NOT NULL,
	created timestamp NOT NULL DEFAULT now(),
	CONSTRAINT login_pk PRIMARY KEY (id),
	CONSTRAINT login_fk FOREIGN KEY (inn) REFERENCES users(inn)
);


