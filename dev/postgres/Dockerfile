FROM postgres:16

ARG POSTGRES_SCHEMA=public

COPY init.sql /docker-entrypoint-initdb.d/init.sql.template

RUN sed "s/${POSTGRES_SCHEMA}/$POSTGRES_SCHEMA/g" /docker-entrypoint-initdb.d/init.sql.template \
    > /docker-entrypoint-initdb.d/init.sql \
    && rm /docker-entrypoint-initdb.d/init.sql.template

