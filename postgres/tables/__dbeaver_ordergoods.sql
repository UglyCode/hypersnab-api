-- Drop table

-- DROP TABLE public.ordergoods;

CREATE TABLE public.ordergoods (
	"order" serial NOT NULL,
	good varchar(16) NOT NULL,
	amount int4 NOT NULL DEFAULT 0,
	price float4 NOT NULL,
	CONSTRAINT ordergoods_pk PRIMARY KEY ("order", good),
	CONSTRAINT ordergoods_fk FOREIGN KEY ("order") REFERENCES orders(id),
	CONSTRAINT ordergoods_fk_1 FOREIGN KEY (good) REFERENCES goods(code)
);

-
