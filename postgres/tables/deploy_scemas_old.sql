-- deploy fresh db tables
\i '/docker-entrypoint-initdb.d/tables/users_create.sql'
\i '/docker-entrypoint-initdb.d/tables/login_create.sql'
\i '/docker-entrypoint-initdb.d/tables/goods_create.sql'
\i '/docker-entrypoint-initdb.d/tables/stock_create.sql'
\i '/docker-entrypoint-initdb.d/tables/orders_create.sql'
\i '/docker-entrypoint-initdb.d/tables/folders_create.sql'
\i '/docker-entrypoint-initdb.d/tables/attributes_create.sql'
\i '/docker-entrypoint-initdb.d/tables/goodsAttributes_create.sql
\i '/docker-entrypoint-initdb.d/tables/prices_create.sql'
\i '/docker-entrypoint-initdb.d/tables/foldersFiltersMatching_create.sql'


-- For testing purposes only. This file will add dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'