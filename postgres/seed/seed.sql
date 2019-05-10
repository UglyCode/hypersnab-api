-- Seed data with a fake user for testing

insert into users (inn, kpp, name, email, phone, contact, address, joined)
    values (7704409586, 770000114, 'a', 'a@a.com', 79995555555, 'mr.Yandex', 'at the middle of nowhere','2019-01-01');
insert into login (hash, inn) values ('$2a$10$WAK21U0LWl7C//jJ.DOB2uPP1DJQh7KUDgasdyQeGzkop2Pzl8W7u', 7704409586);