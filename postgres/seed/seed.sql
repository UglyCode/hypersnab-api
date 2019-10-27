-- Seed data with a fake user for testing
insert into users (inn, kpp, name, email, phone, contact, address, created)
    values (7704409586, 770000114, 'a', 'anton@an.com', 79995555555, 'mr.Robot', 'at the middle of nowhere','2019-01-01');
insert into login (hash, inn) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 7704409586);

--goods initial data for testing
insert into folders (code,folder_name,parent)
   values (1, 'Электромонтажные изделия', 0),
   (101, 'Приборы учета электроэнергии', 1),
   (2, 'Низковольтная автоматика', 0),
   (201, 'Расходные материалы', 2),
   (202, 'Пускорегулирующая аппаратура для люминесцентных ламп', 2);

insert into goods (code, folder, description, measure, sort)
   values (13, 101, 'Счетчик электроэнергии Меркурий 230AM-01 3ф 1т 5-60А', 'шт', 'ert'),
   (14, 101, 'Счетчик электроэнергии Меркурий 230AM-03 3ф 1т 5-7,5А', 'шт', 'sdf'),
   (124, 201, 'Круг отрезной по металлу 230x2,5x22,2мм', 'шт', 'wer'),
   (126, 202, 'Стартер Philips S10 4-65W 220-240V', 'шт', 'qwe'),
   (127, 202, 'Стартер Philips S2 4-22W 127-240V', 'шт', 'qwe');

insert into prices (good,price,spec,updated)
   values (13, 2304.12, true, '2019-01-01'),
   (14, 2282.52, true, '2019-01-01'),
   (124, 74, true,'2019-01-01'),
   (126, 21.12, false, '2019-01-01'),
   (127, 21.12, true,'2019-01-01');

insert into stock (good,stock,maxorder,updated)
   values (13, 230, 0, '2019-01-01'),
   (14, 228, 0, '2019-01-01'),
   (124, 74, 0,'2019-01-01'),
   (126, 212, 0, '2019-01-01'),
   (127, 22, 0,'2019-01-01');

  INSERT INTO public."attributes" (code, attribute_name)
  	VALUES (111,'ТОКИЩЕ');


