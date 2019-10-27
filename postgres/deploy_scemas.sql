-- deploy fresh db tables
\i '/docker-entrypoint-initdb.d/tables/0_users.sql'
\i '/docker-entrypoint-initdb.d/tables/1_login.sql'
\i '/docker-entrypoint-initdb.d/tables/2_goods.sql'
\i '/docker-entrypoint-initdb.d/tables/3_folders.sql'
\i '/docker-entrypoint-initdb.d/tables/4_attributes.sql'
\i '/docker-entrypoint-initdb.d/tables/5_goodsattributes.sql'
\i '/docker-entrypoint-initdb.d/tables/6_foldersattributes.sql'
\i '/docker-entrypoint-initdb.d/tables/7_prices.sql'
\i '/docker-entrypoint-initdb.d/tables/8_stock.sql'
\i '/docker-entrypoint-initdb.d/tables/9_orders.sql'
\i '/docker-entrypoint-initdb.d/tables/10_ordergoods.sql'


-- For testing purposes only. This file will add dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'