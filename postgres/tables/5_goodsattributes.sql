-- Drop table

-- DROP TABLE public.goodsattributes;

CREATE TABLE public.goodsattributes (
	good varchar(16) NOT NULL,
	"attribute" int4 NOT NULL,
	value varchar(32) NOT NULL,
	CONSTRAINT goodsattributes_pk PRIMARY KEY (good, attribute),
	CONSTRAINT goodsattributes_fk FOREIGN KEY (good) REFERENCES goods(code),
	CONSTRAINT goodsattributes_fk_1 FOREIGN KEY (attribute) REFERENCES attributes(code)
);


