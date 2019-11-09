-- Drop table

-- DROP TABLE public.goods;

CREATE TABLE public.goods (
	code varchar(16) NOT NULL,
	folder varchar(16) NOT NULL,
	description varchar(256) NOT NULL,
	measure varchar(8) NOT NULL,
	sort varchar(256) NOT NULL,
	CONSTRAINT goods_pk PRIMARY KEY (code),
	CONSTRAINT goods_fk FOREIGN KEY (folder) REFERENCES folders(code)
);

