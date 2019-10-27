-- Drop table

-- DROP TABLE public.goodsattributes;

CREATE TABLE public.goodsattributes (
	good varchar(16) NOT NULL,
	"attribute" int4 NOT NULL,
	value varchar(32) NOT NULL,
	CONSTRAINT goods_attributes_pk PRIMARY KEY (good, attribute),
	CONSTRAINT goods_attributes_fk FOREIGN KEY (good) REFERENCES goods(code),
	CONSTRAINT goods_attributes_fk_1 FOREIGN KEY (attribute) REFERENCES attributes(code)
);


