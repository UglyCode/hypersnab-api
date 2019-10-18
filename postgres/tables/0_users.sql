-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	inn int8 NOT NULL,
	kpp int8 NULL,
	"name" varchar(256) NULL,
	email varchar(128) NULL,
	phone int8 NULL,
	contact varchar NULL,
	address varchar(256) NULL,
	created timestamp NULL DEFAULT now(),
	CONSTRAINT users_pk PRIMARY KEY (inn)
);