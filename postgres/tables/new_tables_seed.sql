INSERT INTO public.goods
(code, folder, description, measure, sort)
values ('111', '777', 'super nya', 'oz', 'nya'), ('222', '777', 'average nya', 'oz', 'anya');

INSERT INTO public.folders
(code, folder_name, parent)
values ('777', 'kawai', '000'), ('000', 'JPG', null);

INSERT INTO public.prices
(good, price, updated, spec)
values ('111', 75.5, now(), true);

INSERT INTO public.stock
(good, stock, maxorder, updated)
values ('222', 25, 111, now());
