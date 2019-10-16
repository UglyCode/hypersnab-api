-- Seed data with a fake user for testing
insert into users (inn, kpp, name, email, phone, contact, address, joined)
    values (7704409586, 770000114, 'a', 'anton@an.com', 79995555555, 'mr.Robot', 'at the middle of nowhere','2019-01-01');
insert into login (hash, inn) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 7704409586);

--goods initial data for testing
insert into goods (code,folder,description,measure,available,image,updated)
   values (13, 101, 'Счетчик электроэнергии Меркурий 230AM-01 3ф 1т 5-60А', 'шт', true, '','2019-01-01'),
   (14, 101, 'Счетчик электроэнергии Меркурий 230AM-03 3ф 1т 5-7,5А', 'шт', true, '','2019-01-01'),
   (124, 201, 'Круг отрезной по металлу 230x2,5x22,2мм', 'шт', true, '','2019-01-01'),
   (126, 202, 'Стартер Philips S10 4-65W 220-240V', 'шт', false, '','2019-01-01'),
   (127, 202, 'Стартер Philips S2 4-22W 127-240V', 'шт', true, '','2019-01-01');

insert into folders (code,name,parent,image,updated)
   values (1, 'Электромонтажные изделия', 0,'','2019-01-01'),
   (101, 'Приборы учета электроэнергии', 1,'','2019-01-01'),
   (2, 'Низковольтная автоматика', 0,'','2019-01-01'),
   (201, 'Расходные материалы', 2,'','2019-01-01'),
   (202, 'Пускорегулирующая аппаратура для люминесцентных ламп', 2,'','2019-01-01');

insert into prices (good,price,special,updated)
   values (13, 2304.12, true, '2019-01-01'),
   (14, 2282.52, true, '2019-01-01'),
   (124, 74, true,'2019-01-01'),
   (126, 21.12, false, '2019-01-01'),
   (127, 21.12, true,'2019-01-01');

insert into stock (good,amount,maxorder,updated)
   values (13, 230, 0, '2019-01-01'),
   (14, 228, 0, '2019-01-01'),
   (124, 74, 0,'2019-01-01'),
   (126, 212, 0, '2019-01-01'),
   (127, 22, 0,'2019-01-01');

