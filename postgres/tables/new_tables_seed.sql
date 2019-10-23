INSERT INTO public.goods
(code, folder, description, measure, sort)
VALUES('111', '777', 'super nya', 'oz', 'nya'), ('222', '777', 'average nya', 'oz', 'anya');

INSERT INTO public.folders
(code, folder_name, parent)
VALUES('777', 'kawai', '000'), ('000', 'JPG', null);

INSERT INTO public.prices
(good, price, updated, spec)
VALUES('111', 75.5, now(), true);

INSERT INTO public.stock
(good, stock, maxorder, updated)
VALUES('222', 25, 111, now());
