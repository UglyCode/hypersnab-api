FROM postgres

ADD /tables/ /docker-entrypoint-initdb.d/tables/
ADD /seed/ /docker-entrypoint-initdb.d/seed/

ADD deploy_scemas.sql /docker-entrypoint-initdb.d/

