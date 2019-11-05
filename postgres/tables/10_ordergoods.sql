-- Drop table

-- DROP TABLE public.ordergoods;

    CREATE TABLE public.ordered_goods (
        "order" serial NOT NULL,
        good varchar(16) NOT NULL,
        amount int4 NOT NULL DEFAULT 0,
        price float4 NOT NULL,
        CONSTRAINT ordered_goods_pk PRIMARY KEY ("order", good),
        CONSTRAINT ordered_goods_fk FOREIGN KEY ("order") REFERENCES orders(id),
        CONSTRAINT ordered_goods_fk_1 FOREIGN KEY (good) REFERENCES goods(code)
    );

