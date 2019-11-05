CREATE TABLE public.folders (
	code varchar(16) NOT NULL,
	folder_name varchar(128) NOT NULL,
	parent varchar(16) NULL,
	CONSTRAINT folders_pk PRIMARY KEY (code)
);

CREATE TABLE public.goods (
	code varchar(16) NOT NULL,
	folder varchar(16) NOT NULL,
	description varchar(256) NOT NULL,
	measure varchar(8) NOT NULL,
	sort varchar(32) NOT NULL,
	CONSTRAINT goods_pk PRIMARY KEY (code),
	CONSTRAINT goods_fk FOREIGN KEY (folder) REFERENCES folders(code)
);

CREATE TABLE public."attributes" (
	code int4 NOT NULL,
	attribute_name varchar NOT NULL,
	CONSTRAINT attributes_pk PRIMARY KEY (code)
);

CREATE TABLE public.goodsattributes (
	good varchar(16) NOT NULL,
	"attribute" int4 NOT NULL,
	value varchar(32) NOT NULL,
	CONSTRAINT goods_attributes_pk PRIMARY KEY (good, attribute),
	CONSTRAINT goods_attributes_fk FOREIGN KEY (good) REFERENCES goods(code),
	CONSTRAINT goods_attributes_fk_1 FOREIGN KEY (attribute) REFERENCES attributes(code)
);

CREATE TABLE public.folders_attributes (
	folder varchar(16) NOT NULL,
	"attribute" int4 NOT NULL,
	"name" varchar(32) NULL,
	CONSTRAINT folders_attributes_pk PRIMARY KEY (folder, attribute),
	CONSTRAINT folders_attributes_fk FOREIGN KEY (folder) REFERENCES folders(code),
	CONSTRAINT folders_attributes_fk_1 FOREIGN KEY (attribute) REFERENCES attributes(code)
);

CREATE TABLE public.prices (
	good varchar(16) NOT NULL,
	price float4 NOT NULL DEFAULT 0,
	updated timestamp NOT NULL DEFAULT now(),
	spec bool NOT NULL DEFAULT false,
	CONSTRAINT prices_pk PRIMARY KEY (good),
	CONSTRAINT prices_fk FOREIGN KEY (good) REFERENCES goods(code)
);

CREATE TABLE public.stock (
	good varchar(16) NOT NULL,
	stock int4 NOT NULL DEFAULT 0,
	maxorder int4 NULL,
	updated timestamp NOT NULL DEFAULT now(),
	CONSTRAINT stock_pk PRIMARY KEY (good),
	CONSTRAINT stock_fk FOREIGN KEY (good) REFERENCES goods(code)
);

CREATE TABLE public.orders (
	id serial NOT NULL,
	client int8 NOT NULL,
	status varchar(16) NOT NULL,
	updated timestamp NOT NULL DEFAULT now(),
	CONSTRAINT order_pk PRIMARY KEY (id),
	CONSTRAINT order_fk FOREIGN KEY (client) REFERENCES users(inn)
);

CREATE TABLE public.ordered_goods (
    "order" serial NOT NULL,
    good varchar(16) NOT NULL,
    amount int4 NOT NULL DEFAULT 0,
    price float4 NOT NULL,
    CONSTRAINT ordered_goods_pk PRIMARY KEY ("order", good),
    CONSTRAINT ordered_goods_fk FOREIGN KEY ("order") REFERENCES orders(id),
    CONSTRAINT ordered_goods_fk_1 FOREIGN KEY (good) REFERENCES goods(code)
);
