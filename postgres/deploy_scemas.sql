-- deploy fresh db tables
\i '/docker-entrypoint-initdb.d/tables/users_create.sql'
\i '/docker-entrypoint-initdb.d/tables/login_create.sql'

-- For testing purposes only. This file will add dummy data
\i '/docker-entrypoint-initdb.d/seed/seed.sql'