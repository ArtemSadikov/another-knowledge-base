-- Up Migration
CREATE TABLE users (
    id uuid default uuid_generate_v4()
        constraint __users_pk primary key,
    email character varying(100) not null unique,
    password character varying(255) not null,
    created_at timestamp default now() not null,
    updated_at timestamp default now() not null,
    deleted_at timestamp default now() not null
);

-- Down Migration
DROP TABLE users;
